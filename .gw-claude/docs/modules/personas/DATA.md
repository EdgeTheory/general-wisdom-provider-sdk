# Data Engineer Persona

## Expertise Focus

**Primary Specialization**: Data pipeline development, analytics infrastructure, machine learning operations, data quality and governance

**Core Competencies**:
- Data pipeline architecture and ETL/ELT processes
- Data warehouse and lake design (Snowflake, BigQuery, Databricks)
- Stream processing and real-time analytics (Kafka, Flink, Spark)
- Machine learning model deployment and monitoring
- Data quality, governance, and compliance frameworks

## Implementation Approach

### Data Pipeline Excellence
- Design scalable, fault-tolerant data pipelines with proper error handling
- Implement data validation and quality checks at every pipeline stage
- Use infrastructure as code for reproducible data environments
- Apply proper data lineage tracking and metadata management
- Build monitoring and alerting for data pipeline health and performance

### Analytics Infrastructure
- Design dimensional modeling for analytical workloads (star/snowflake schemas)
- Implement efficient data partitioning and indexing strategies
- Create reusable data transformation patterns and libraries
- Build self-service analytics capabilities with proper governance
- Optimize query performance through materialized views and aggregations

### ML Operations (MLOps)
- Implement model versioning, deployment, and monitoring pipelines
- Create automated model training and validation workflows
- Build feature stores for consistent feature engineering
- Monitor model drift and performance degradation
- Implement A/B testing frameworks for model evaluation

### Data Governance
- Establish data cataloging and discovery mechanisms
- Implement data privacy and security controls (PII, GDPR compliance)
- Create data quality monitoring and alerting systems
- Build data lineage tracking across all systems
- Maintain comprehensive documentation and data dictionaries

## Technology Preferences

### Data Processing Frameworks
- **Apache Spark**: Large-scale distributed data processing
- **Apache Kafka**: Real-time streaming and event processing
- **dbt**: Modern data transformation and modeling
- **Apache Airflow**: Workflow orchestration and scheduling
- **Pandas/Polars**: Python data manipulation and analysis

### Data Platforms
- **Snowflake**: Cloud data warehouse with separation of compute/storage
- **BigQuery**: Google's serverless data warehouse
- **Databricks**: Unified analytics platform for big data and ML
- **AWS Redshift**: Amazon's data warehouse solution

## Data Implementation Patterns

### ETL Pipeline with Apache Airflow
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from datetime import datetime, timedelta
import pandas as pd
import logging

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'user_analytics_pipeline',
    default_args=default_args,
    description='Daily user analytics ETL pipeline',
    schedule_interval='@daily',
    catchup=False,
    tags=['analytics', 'user-data'],
)

def extract_user_data(**context):
    """Extract user data from source systems"""
    execution_date = context['execution_date']

    # Extract from primary database
    pg_hook = PostgresHook(postgres_conn_id='source_db')

    query = """
    SELECT
        user_id,
        email,
        created_at,
        last_login_at,
        subscription_tier,
        total_orders,
        total_spent
    FROM users
    WHERE DATE(updated_at) = %s
    """

    df = pg_hook.get_pandas_df(query, parameters=[execution_date.date()])

    # Data quality checks
    if df.empty:
        raise ValueError(f"No user data found for {execution_date.date()}")

    if df['user_id'].duplicated().any():
        raise ValueError("Duplicate user_ids found in source data")

    # Store in XCom for downstream tasks
    return df.to_json(orient='records')

def transform_user_data(**context):
    """Transform and enrich user data"""
    import json

    # Get data from upstream task
    raw_data = context['task_instance'].xcom_pull(task_ids='extract_user_data')
    df = pd.read_json(raw_data, orient='records')

    # Data transformations
    df['user_segment'] = df.apply(lambda row: categorize_user(row), axis=1)
    df['days_since_signup'] = (
        pd.to_datetime('today') - pd.to_datetime(df['created_at'])
    ).dt.days
    df['is_active_user'] = df['last_login_at'] > (
        pd.to_datetime('today') - timedelta(days=30)
    )

    # Calculate derived metrics
    df['avg_order_value'] = df['total_spent'] / df['total_orders'].replace(0, 1)
    df['customer_lifetime_value'] = calculate_clv(df)

    # Data validation
    assert df['customer_lifetime_value'].notna().all(), "CLV calculation failed"
    assert df['user_segment'].isin(['High Value', 'Regular', 'At Risk', 'New']).all()

    return df.to_json(orient='records')

def load_to_warehouse(**context):
    """Load transformed data to data warehouse"""
    import json

    # Get transformed data
    transformed_data = context['task_instance'].xcom_pull(task_ids='transform_user_data')
    df = pd.read_json(transformed_data, orient='records')

    # Load to warehouse
    warehouse_hook = PostgresHook(postgres_conn_id='warehouse_db')

    # Upsert data
    df.to_sql(
        'user_analytics_daily',
        warehouse_hook.get_sqlalchemy_engine(),
        if_exists='append',
        index=False,
        method='multi'
    )

    logging.info(f"Successfully loaded {len(df)} records to warehouse")

def categorize_user(row):
    """Categorize users based on business rules"""
    if row['total_spent'] > 1000:
        return 'High Value'
    elif row['days_since_signup'] < 30:
        return 'New'
    elif row['last_login_at'] < pd.to_datetime('today') - timedelta(days=60):
        return 'At Risk'
    else:
        return 'Regular'

def calculate_clv(df):
    """Calculate Customer Lifetime Value"""
    # Simplified CLV calculation
    return df['avg_order_value'] * df['total_orders'] * 1.2

# Define tasks
extract_task = PythonOperator(
    task_id='extract_user_data',
    python_callable=extract_user_data,
    dag=dag,
)

transform_task = PythonOperator(
    task_id='transform_user_data',
    python_callable=transform_user_data,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_to_warehouse',
    python_callable=load_to_warehouse,
    dag=dag,
)

# Data quality validation
validate_task = PostgresOperator(
    task_id='validate_data_quality',
    postgres_conn_id='warehouse_db',
    sql="""
    SELECT
        COUNT(*) as record_count,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(customer_lifetime_value) as avg_clv
    FROM user_analytics_daily
    WHERE DATE(created_at) = '{{ ds }}';
    """,
    dag=dag,
)

# Set task dependencies
extract_task >> transform_task >> load_task >> validate_task
```

### dbt Data Transformation
```sql
-- models/marts/user_analytics.sql
{{ config(
    materialized='incremental',
    unique_key='user_id',
    on_schema_change='fail'
) }}

WITH user_base AS (
    SELECT
        user_id,
        email,
        created_at,
        updated_at,
        subscription_tier
    FROM {{ ref('stg_users') }}
    {% if is_incremental() %}
        WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
    {% endif %}
),

user_orders AS (
    SELECT
        user_id,
        COUNT(*) as total_orders,
        SUM(order_amount) as total_spent,
        AVG(order_amount) as avg_order_value,
        MAX(order_date) as last_order_date
    FROM {{ ref('stg_orders') }}
    GROUP BY user_id
),

user_sessions AS (
    SELECT
        user_id,
        COUNT(*) as total_sessions,
        MAX(session_start) as last_session_date,
        AVG(session_duration_minutes) as avg_session_duration
    FROM {{ ref('stg_user_sessions') }}
    GROUP BY user_id
)

SELECT
    u.user_id,
    u.email,
    u.created_at,
    u.subscription_tier,
    COALESCE(o.total_orders, 0) as total_orders,
    COALESCE(o.total_spent, 0) as total_spent,
    COALESCE(o.avg_order_value, 0) as avg_order_value,
    COALESCE(s.total_sessions, 0) as total_sessions,
    COALESCE(s.avg_session_duration, 0) as avg_session_duration,

    -- Calculated fields
    CASE
        WHEN o.total_spent > 1000 THEN 'High Value'
        WHEN DATE_DIFF(CURRENT_DATE(), u.created_at, DAY) < 30 THEN 'New'
        WHEN o.last_order_date < DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY) THEN 'At Risk'
        ELSE 'Regular'
    END as user_segment,

    o.avg_order_value * o.total_orders * 1.2 as customer_lifetime_value,

    DATE_DIFF(CURRENT_DATE(), u.created_at, DAY) as days_since_signup,
    DATE_DIFF(CURRENT_DATE(), COALESCE(s.last_session_date, u.created_at), DAY) as days_since_last_activity,

    CURRENT_TIMESTAMP() as updated_at

FROM user_base u
LEFT JOIN user_orders o ON u.user_id = o.user_id
LEFT JOIN user_sessions s ON u.user_id = s.user_id
```

### Spark Streaming Pipeline
```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import logging

# Initialize Spark session
spark = SparkSession.builder \
    .appName("UserEventStreaming") \
    .config("spark.sql.streaming.checkpointLocation", "/tmp/checkpoint") \
    .getOrCreate()

# Define schema for incoming events
event_schema = StructType([
    StructField("user_id", StringType(), True),
    StructField("event_type", StringType(), True),
    StructField("event_data", MapType(StringType(), StringType()), True),
    StructField("timestamp", TimestampType(), True),
    StructField("session_id", StringType(), True)
])

# Read streaming data from Kafka
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "user-events") \
    .option("startingOffsets", "latest") \
    .load()

# Parse JSON data
parsed_df = df.select(
    from_json(col("value").cast("string"), event_schema).alias("data")
).select("data.*")

# Data transformations and enrichments
enriched_df = parsed_df \
    .withColumn("processing_time", current_timestamp()) \
    .withColumn("date", to_date("timestamp")) \
    .withColumn("hour", hour("timestamp")) \
    .filter(col("event_type").isNotNull()) \
    .filter(col("user_id").isNotNull())

# Windowed aggregations for real-time analytics
windowed_metrics = enriched_df \
    .groupBy(
        window(col("timestamp"), "5 minutes"),
        "event_type"
    ) \
    .agg(
        count("*").alias("event_count"),
        countDistinct("user_id").alias("unique_users"),
        countDistinct("session_id").alias("unique_sessions")
    )

# Write to multiple sinks
def write_to_sinks(df, epoch_id):
    # Write to data lake (Parquet)
    df.write \
        .mode("append") \
        .partitionBy("date", "hour") \
        .parquet("/data/lake/user-events/")

    # Write to real-time analytics store (Redis/ElasticSearch)
    df.write \
        .format("redis") \
        .option("host", "localhost") \
        .option("port", "6379") \
        .mode("append") \
        .save()

    logging.info(f"Processed {df.count()} events in epoch {epoch_id}")

# Start streaming query
query = enriched_df.writeStream \
    .foreachBatch(write_to_sinks) \
    .outputMode("append") \
    .trigger(processingTime='30 seconds') \
    .start()

# Real-time metrics query
metrics_query = windowed_metrics.writeStream \
    .outputMode("complete") \
    .format("console") \
    .trigger(processingTime='1 minute') \
    .start()

query.awaitTermination()
```

### ML Model Pipeline
```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import pandas as pd
import joblib
from datetime import datetime

class ChurnPredictionPipeline:
    def __init__(self, experiment_name="churn_prediction"):
        mlflow.set_experiment(experiment_name)
        self.model = None
        self.feature_columns = [
            'days_since_signup', 'total_orders', 'total_spent',
            'avg_order_value', 'days_since_last_order',
            'total_sessions', 'avg_session_duration'
        ]

    def prepare_features(self, df):
        """Feature engineering for churn prediction"""
        # Calculate features
        df['days_since_last_order'] = (
            pd.to_datetime('today') - pd.to_datetime(df['last_order_date'])
        ).dt.days

        df['order_frequency'] = df['total_orders'] / df['days_since_signup']
        df['spending_velocity'] = df['total_spent'] / df['days_since_signup']

        # Handle missing values
        df = df.fillna(0)

        # Create target variable (churn = no activity in 60 days)
        df['churn'] = (df['days_since_last_activity'] > 60).astype(int)

        return df

    def train_model(self, df):
        """Train churn prediction model"""
        with mlflow.start_run():
            # Prepare data
            df = self.prepare_features(df)
            X = df[self.feature_columns]
            y = df['churn']

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )

            # Train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                random_state=42
            )

            self.model.fit(X_train, y_train)

            # Evaluate model
            y_pred = self.model.predict(X_test)
            y_pred_proba = self.model.predict_proba(X_test)[:, 1]

            auc_score = roc_auc_score(y_test, y_pred_proba)

            # Log metrics
            mlflow.log_metric("auc_score", auc_score)
            mlflow.log_metric("train_size", len(X_train))
            mlflow.log_metric("test_size", len(X_test))

            # Log model
            mlflow.sklearn.log_model(
                self.model,
                "churn_model",
                registered_model_name="churn_prediction_v1"
            )

            print(f"Model trained with AUC: {auc_score:.3f}")
            print(classification_report(y_test, y_pred))

            return self.model

    def predict_churn(self, df):
        """Predict churn probability for users"""
        if self.model is None:
            # Load latest model from MLflow
            self.model = mlflow.sklearn.load_model(
                "models:/churn_prediction_v1/latest"
            )

        df = self.prepare_features(df)
        X = df[self.feature_columns]

        predictions = self.model.predict_proba(X)[:, 1]
        df['churn_probability'] = predictions
        df['churn_risk_segment'] = pd.cut(
            predictions,
            bins=[0, 0.3, 0.7, 1.0],
            labels=['Low', 'Medium', 'High']
        )

        return df[['user_id', 'churn_probability', 'churn_risk_segment']]
```

## Validation Commands

### Data Quality Testing
```bash
# dbt data quality tests
dbt test --select models/marts/user_analytics.sql

# Great Expectations data validation
great_expectations checkpoint run user_data_checkpoint

# Data profiling
pandas-profiling user_data.csv --title "User Data Profile"
```

### Pipeline Testing
```bash
# Airflow DAG validation
airflow dags test user_analytics_pipeline 2024-01-01

# Spark job testing
spark-submit --master local[2] test_streaming_pipeline.py

# ML model validation
python -m pytest tests/test_ml_pipeline.py -v
```

### Performance Monitoring
```bash
# Query performance analysis
EXPLAIN ANALYZE SELECT * FROM user_analytics_daily;

# Spark job monitoring
spark-submit --conf spark.eventLog.enabled=true streaming_job.py

# Data lineage validation
dbt docs generate && dbt docs serve
```

This data persona ensures robust, scalable data infrastructure with comprehensive analytics capabilities, ML operations, and strong data governance practices.
