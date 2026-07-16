# Data Domain Context

## When This Module Loads

**Trigger Keywords**: data, analytics, pipeline, etl, warehouse, ml, machine learning, spark, kafka, airflow

**Intent Patterns**: data_processing, analytics_setup, ml_pipeline, data_warehouse, etl_development

**Tools Predicted**: pandas, spark, airflow, dbt, kafka, snowflake, bigquery, tensorflow, scikit-learn

## Data Engineering Principles

### Data Pipeline Architecture
- **Scalable Processing**: Design for horizontal scaling with distributed computing
- **Fault Tolerance**: Implement robust error handling and recovery mechanisms
- **Data Quality**: Comprehensive validation and monitoring at every stage
- **Lineage Tracking**: Maintain complete data provenance and dependency mapping
- **Idempotent Operations**: Ensure pipeline reruns produce consistent results

### Analytics Infrastructure
- **Dimensional Modeling**: Star and snowflake schemas for analytical workloads
- **Performance Optimization**: Partitioning, indexing, and query optimization
- **Self-Service Analytics**: Enable business users with proper governance
- **Real-Time Processing**: Stream processing for low-latency requirements
- **Data Governance**: Privacy, security, and compliance frameworks

### Machine Learning Operations
- **Model Lifecycle Management**: Version control, deployment, and monitoring
- **Feature Engineering**: Reusable feature stores and transformation pipelines
- **Experimentation Framework**: A/B testing and model comparison infrastructure
- **Model Monitoring**: Drift detection and performance degradation alerts
- **Automated Retraining**: Continuous learning and model updates

### Data Quality and Governance
- **Data Cataloging**: Comprehensive metadata management and discovery
- **Privacy Controls**: PII detection, masking, and compliance (GDPR, CCPA)
- **Access Management**: Role-based access control and audit logging
- **Data Standards**: Consistent naming conventions and data formats
- **Documentation**: Comprehensive data dictionaries and business context

## Data Implementation Patterns

### Apache Airflow ETL Pipeline
```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
from datetime import datetime, timedelta
import pandas as pd
import logging

default_args = {
    'owner': 'data-engineering',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
}

dag = DAG(
    'customer_analytics_pipeline',
    default_args=default_args,
    description='Daily customer analytics ETL with ML predictions',
    schedule_interval='@daily',
    catchup=False,
    max_active_runs=1,
    tags=['analytics', 'ml', 'customer'],
)

def extract_customer_data(**context):
    """Extract customer data with incremental loading"""
    execution_date = context['execution_date']

    pg_hook = PostgresHook(postgres_conn_id='source_db')

    # Incremental extraction with bookmark
    query = """
    WITH customer_base AS (
        SELECT
            customer_id,
            email,
            registration_date,
            last_login_date,
            subscription_tier,
            country,
            updated_at
        FROM customers
        WHERE DATE(updated_at) >= %s - INTERVAL '1 day'
          AND DATE(updated_at) <= %s
    ),
    customer_orders AS (
        SELECT
            customer_id,
            COUNT(*) as order_count,
            SUM(order_total) as total_spent,
            AVG(order_total) as avg_order_value,
            MAX(order_date) as last_order_date,
            MIN(order_date) as first_order_date
        FROM orders
        WHERE order_date >= %s - INTERVAL '30 days'
        GROUP BY customer_id
    ),
    customer_sessions AS (
        SELECT
            customer_id,
            COUNT(*) as session_count,
            SUM(session_duration) as total_session_time,
            AVG(session_duration) as avg_session_duration,
            MAX(session_start) as last_session_date
        FROM user_sessions
        WHERE DATE(session_start) >= %s - INTERVAL '7 days'
        GROUP BY customer_id
    )
    SELECT
        c.*,
        COALESCE(o.order_count, 0) as order_count,
        COALESCE(o.total_spent, 0) as total_spent,
        COALESCE(o.avg_order_value, 0) as avg_order_value,
        o.last_order_date,
        o.first_order_date,
        COALESCE(s.session_count, 0) as session_count,
        COALESCE(s.total_session_time, 0) as total_session_time,
        COALESCE(s.avg_session_duration, 0) as avg_session_duration,
        s.last_session_date
    FROM customer_base c
    LEFT JOIN customer_orders o ON c.customer_id = o.customer_id
    LEFT JOIN customer_sessions s ON c.customer_id = s.customer_id
    ORDER BY c.updated_at DESC
    """

    df = pg_hook.get_pandas_df(
        query,
        parameters=[execution_date.date()] * 4
    )

    # Data quality checks
    if df.empty:
        logging.warning(f"No customer data found for {execution_date.date()}")
        return None

    # Validate data integrity
    assert not df['customer_id'].duplicated().any(), "Duplicate customer IDs found"
    assert df['email'].notna().all(), "Missing email addresses found"

    logging.info(f"Extracted {len(df)} customer records")
    return df.to_json(orient='records', date_format='iso')

def transform_customer_data(**context):
    """Transform and enrich customer data"""
    import json
    from sklearn.preprocessing import StandardScaler
    import numpy as np

    # Get extracted data
    raw_data = context['task_instance'].xcom_pull(task_ids='extract_customer_data')
    if not raw_data:
        return None

    df = pd.read_json(raw_data, orient='records')

    # Feature engineering
    current_date = pd.to_datetime('today')

    # Temporal features
    df['days_since_registration'] = (
        current_date - pd.to_datetime(df['registration_date'])
    ).dt.days

    df['days_since_last_order'] = (
        current_date - pd.to_datetime(df['last_order_date'])
    ).dt.days.fillna(9999)

    df['days_since_last_session'] = (
        current_date - pd.to_datetime(df['last_session_date'])
    ).dt.days.fillna(9999)

    # Behavioral features
    df['order_frequency'] = df['order_count'] / (df['days_since_registration'] + 1)
    df['spending_velocity'] = df['total_spent'] / (df['days_since_registration'] + 1)
    df['session_frequency'] = df['session_count'] / 7  # Weekly average

    # Customer segmentation
    df['customer_segment'] = df.apply(lambda row: segment_customer(row), axis=1)

    # RFM analysis
    df['recency_score'] = pd.qcut(df['days_since_last_order'], 5, labels=[5,4,3,2,1])
    df['frequency_score'] = pd.qcut(df['order_count'], 5, labels=[1,2,3,4,5], duplicates='drop')
    df['monetary_score'] = pd.qcut(df['total_spent'], 5, labels=[1,2,3,4,5], duplicates='drop')

    # Calculate CLV (Customer Lifetime Value)
    df['customer_lifetime_value'] = calculate_clv(df)

    # Churn risk scoring
    df['churn_risk_score'] = calculate_churn_risk(df)
    df['churn_risk_category'] = pd.cut(
        df['churn_risk_score'],
        bins=[0, 0.3, 0.7, 1.0],
        labels=['Low', 'Medium', 'High']
    )

    # Data validation
    assert df['customer_lifetime_value'].notna().all(), "CLV calculation failed"
    assert df['customer_segment'].isin(['Champion', 'Loyal', 'Potential', 'At Risk', 'Lost']).all()

    logging.info(f"Transformed {len(df)} customer records with features")
    return df.to_json(orient='records', date_format='iso')

def segment_customer(row):
    """Business logic for customer segmentation"""
    if row['total_spent'] > 1000 and row['order_frequency'] > 0.1:
        return 'Champion'
    elif row['total_spent'] > 500 and row['days_since_last_order'] < 60:
        return 'Loyal'
    elif row['days_since_registration'] < 90:
        return 'Potential'
    elif row['days_since_last_order'] > 180:
        return 'At Risk'
    else:
        return 'Lost'

def calculate_clv(df):
    """Calculate Customer Lifetime Value using simplified formula"""
    avg_order_value = df['avg_order_value']
    purchase_frequency = df['order_frequency'] * 365  # Annual frequency
    avg_customer_lifespan = np.minimum(df['days_since_registration'] / 365, 5)  # Cap at 5 years

    return avg_order_value * purchase_frequency * avg_customer_lifespan

def calculate_churn_risk(df):
    """Calculate churn risk score using multiple factors"""
    from sklearn.preprocessing import MinMaxScaler

    # Normalize features for scoring
    scaler = MinMaxScaler()

    features = [
        'days_since_last_order',
        'days_since_last_session',
        'order_frequency',
        'session_frequency'
    ]

    # Higher values for time-based features indicate higher churn risk
    risk_scores = []
    for _, row in df.iterrows():
        score = 0

        # Recency factors (higher = more risk)
        if row['days_since_last_order'] > 90:
            score += 0.4
        elif row['days_since_last_order'] > 30:
            score += 0.2

        # Frequency factors (lower = more risk)
        if row['order_frequency'] < 0.01:  # Less than 1 order per 100 days
            score += 0.3

        if row['session_frequency'] < 0.5:  # Less than 3.5 sessions per week
            score += 0.2

        # Engagement factors
        if row['avg_session_duration'] < 300:  # Less than 5 minutes
            score += 0.1

        risk_scores.append(min(score, 1.0))  # Cap at 1.0

    return risk_scores

def load_to_warehouse(**context):
    """Load transformed data to data warehouse"""
    import json

    transformed_data = context['task_instance'].xcom_pull(task_ids='transform_customer_data')
    if not transformed_data:
        return

    df = pd.read_json(transformed_data, orient='records')

    # Load to warehouse with upsert logic
    warehouse_hook = PostgresHook(postgres_conn_id='warehouse_db')

    # Create staging table
    staging_table = f"customer_analytics_staging_{context['execution_date'].strftime('%Y%m%d')}"

    df.to_sql(
        staging_table,
        warehouse_hook.get_sqlalchemy_engine(),
        if_exists='replace',
        index=False,
        method='multi'
    )

    # Upsert to main table
    upsert_sql = f"""
    INSERT INTO customer_analytics_daily
    SELECT * FROM {staging_table}
    ON CONFLICT (customer_id, date)
    DO UPDATE SET
        order_count = EXCLUDED.order_count,
        total_spent = EXCLUDED.total_spent,
        customer_segment = EXCLUDED.customer_segment,
        customer_lifetime_value = EXCLUDED.customer_lifetime_value,
        churn_risk_score = EXCLUDED.churn_risk_score,
        churn_risk_category = EXCLUDED.churn_risk_category,
        updated_at = CURRENT_TIMESTAMP;

    DROP TABLE {staging_table};
    """

    warehouse_hook.run(upsert_sql)
    logging.info(f"Successfully loaded {len(df)} records to warehouse")

def run_ml_predictions(**context):
    """Run ML model predictions for churn and CLV"""
    import joblib
    import boto3

    # Load model from S3 or model registry
    s3 = boto3.client('s3')
    s3.download_file('ml-models-bucket', 'churn_model.pkl', '/tmp/churn_model.pkl')

    churn_model = joblib.load('/tmp/churn_model.pkl')

    # Get data for prediction
    warehouse_hook = PostgresHook(postgres_conn_id='warehouse_db')

    query = """
    SELECT customer_id, days_since_registration, order_count, total_spent,
           avg_order_value, days_since_last_order, session_count,
           avg_session_duration, order_frequency, spending_velocity
    FROM customer_analytics_daily
    WHERE date = %s
    """

    df = warehouse_hook.get_pandas_df(query, parameters=[context['execution_date'].date()])

    if df.empty:
        logging.warning("No data available for ML predictions")
        return

    # Prepare features
    feature_columns = [
        'days_since_registration', 'order_count', 'total_spent',
        'avg_order_value', 'days_since_last_order', 'session_count',
        'avg_session_duration', 'order_frequency', 'spending_velocity'
    ]

    X = df[feature_columns].fillna(0)

    # Make predictions
    churn_predictions = churn_model.predict_proba(X)[:, 1]

    # Update warehouse with predictions
    df['ml_churn_probability'] = churn_predictions
    df['ml_churn_prediction'] = (churn_predictions > 0.5).astype(int)

    # Save predictions back to warehouse
    predictions_df = df[['customer_id', 'ml_churn_probability', 'ml_churn_prediction']]

    for _, row in predictions_df.iterrows():
        update_sql = """
        UPDATE customer_analytics_daily
        SET ml_churn_probability = %s, ml_churn_prediction = %s, ml_updated_at = CURRENT_TIMESTAMP
        WHERE customer_id = %s AND date = %s
        """
        warehouse_hook.run(update_sql, parameters=[
            row['ml_churn_probability'],
            row['ml_churn_prediction'],
            row['customer_id'],
            context['execution_date'].date()
        ])

    logging.info(f"ML predictions completed for {len(df)} customers")

# Define tasks
extract_task = PythonOperator(
    task_id='extract_customer_data',
    python_callable=extract_customer_data,
    dag=dag,
)

transform_task = PythonOperator(
    task_id='transform_customer_data',
    python_callable=transform_customer_data,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_to_warehouse',
    python_callable=load_to_warehouse,
    dag=dag,
)

ml_predictions_task = PythonOperator(
    task_id='run_ml_predictions',
    python_callable=run_ml_predictions,
    dag=dag,
)

# Data quality validation
data_quality_task = PostgresOperator(
    task_id='validate_data_quality',
    postgres_conn_id='warehouse_db',
    sql="""
    SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT customer_id) as unique_customers,
        AVG(customer_lifetime_value) as avg_clv,
        AVG(churn_risk_score) as avg_churn_risk,
        COUNT(*) FILTER (WHERE churn_risk_category = 'High') as high_risk_customers
    FROM customer_analytics_daily
    WHERE date = '{{ ds }}';
    """,
    dag=dag,
)

# Slack notification on completion
success_notification = SlackWebhookOperator(
    task_id='success_notification',
    http_conn_id='slack_webhook',
    message='Customer analytics pipeline completed successfully for {{ ds }}',
    dag=dag,
    trigger_rule='all_success',
)

# Set task dependencies
extract_task >> transform_task >> load_task >> [ml_predictions_task, data_quality_task] >> success_notification
```

### dbt Data Transformation
```sql
-- models/marts/customer_cohort_analysis.sql
{{ config(
    materialized='table',
    indexes=[
      {'columns': ['cohort_month'], 'type': 'btree'},
      {'columns': ['customer_id'], 'type': 'btree'}
    ]
) }}

WITH customer_orders AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(order_date)) as cohort_month,
        DATE_TRUNC('month', order_date) as order_month,
        COUNT(*) as orders_in_month,
        SUM(order_total) as revenue_in_month
    FROM {{ ref('stg_orders') }}
    WHERE order_date >= '2023-01-01'
    GROUP BY 1, 2, 3
),

cohort_table AS (
    SELECT
        cohort_month,
        COUNT(DISTINCT customer_id) as customers_in_cohort
    FROM customer_orders
    GROUP BY 1
),

cohort_retention AS (
    SELECT
        co.cohort_month,
        co.order_month,
        COUNT(DISTINCT co.customer_id) as customers_active,
        ct.customers_in_cohort,
        ROUND(
            100.0 * COUNT(DISTINCT co.customer_id) / ct.customers_in_cohort,
            2
        ) as retention_rate,
        DATE_PART('month', AGE(co.order_month, co.cohort_month)) as month_number,
        SUM(co.revenue_in_month) as cohort_revenue
    FROM customer_orders co
    JOIN cohort_table ct ON co.cohort_month = ct.cohort_month
    GROUP BY 1, 2, 4, 6
),

cohort_metrics AS (
    SELECT
        cohort_month,
        month_number,
        customers_active,
        customers_in_cohort,
        retention_rate,
        cohort_revenue,
        LAG(retention_rate) OVER (
            PARTITION BY cohort_month
            ORDER BY month_number
        ) as prev_month_retention,
        cohort_revenue / NULLIF(customers_active, 0) as revenue_per_active_customer
    FROM cohort_retention
)

SELECT
    cohort_month,
    month_number,
    customers_active,
    customers_in_cohort,
    retention_rate,
    COALESCE(retention_rate - prev_month_retention, 0) as retention_change,
    cohort_revenue,
    revenue_per_active_customer,

    -- Cohort quality metrics
    CASE
        WHEN month_number = 0 THEN NULL
        WHEN retention_rate >= 40 THEN 'High Quality'
        WHEN retention_rate >= 20 THEN 'Medium Quality'
        ELSE 'Low Quality'
    END as cohort_quality,

    CURRENT_TIMESTAMP as updated_at

FROM cohort_metrics
WHERE month_number <= 12  -- Limit to first 12 months
ORDER BY cohort_month, month_number

-- Add data quality tests
{{ test_not_null(['cohort_month', 'customers_in_cohort']) }}
{{ test_positive(['customers_active', 'retention_rate']) }}
```

### Real-Time Streaming with Kafka/Spark
```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import logging

# Initialize Spark session with Kafka integration
spark = SparkSession.builder \
    .appName("RealTimeCustomerAnalytics") \
    .config("spark.sql.streaming.checkpointLocation", "/tmp/checkpoint") \
    .config("spark.sql.streaming.stateStore.maintenanceInterval", "60s") \
    .getOrCreate()

# Define schema for customer events
event_schema = StructType([
    StructField("customer_id", StringType(), True),
    StructField("event_type", StringType(), True),
    StructField("event_data", MapType(StringType(), StringType()), True),
    StructField("timestamp", TimestampType(), True),
    StructField("session_id", StringType(), True),
    StructField("page_url", StringType(), True),
    StructField("user_agent", StringType(), True)
])

# Read streaming data from Kafka
customer_events = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "customer-events,purchase-events,session-events") \
    .option("startingOffsets", "latest") \
    .option("failOnDataLoss", "false") \
    .load()

# Parse and enrich events
parsed_events = customer_events.select(
    from_json(col("value").cast("string"), event_schema).alias("data"),
    col("topic"),
    col("partition"),
    col("offset"),
    col("timestamp").alias("kafka_timestamp")
).select("data.*", "topic", "partition", "offset", "kafka_timestamp")

# Add processing metadata
enriched_events = parsed_events \
    .withColumn("processing_time", current_timestamp()) \
    .withColumn("date", to_date("timestamp")) \
    .withColumn("hour", hour("timestamp")) \
    .filter(col("event_type").isNotNull()) \
    .filter(col("customer_id").isNotNull())

# Real-time customer behavior analysis
customer_session_metrics = enriched_events \
    .filter(col("event_type").isin(["page_view", "click", "scroll"])) \
    .groupBy(
        "customer_id",
        "session_id",
        window(col("timestamp"), "30 minutes")
    ) \
    .agg(
        count("*").alias("event_count"),
        countDistinct("page_url").alias("unique_pages"),
        (max("timestamp").cast("long") - min("timestamp").cast("long")).alias("session_duration"),
        collect_list("event_type").alias("event_sequence")
    ) \
    .withColumn("engagement_score",
                col("event_count") * 0.3 +
                col("unique_pages") * 0.4 +
                least(col("session_duration") / 60, lit(30)) * 0.3)

# Real-time purchase analysis
purchase_events = enriched_events \
    .filter(col("event_type") == "purchase") \
    .select(
        "customer_id",
        "timestamp",
        col("event_data.order_total").cast("double").alias("order_total"),
        col("event_data.product_category").alias("product_category"),
        col("event_data.payment_method").alias("payment_method")
    ) \
    .withWatermark("timestamp", "10 minutes")

# Calculate real-time customer metrics
customer_realtime_metrics = purchase_events \
    .groupBy(
        "customer_id",
        window(col("timestamp"), "1 hour", "15 minutes")
    ) \
    .agg(
        count("*").alias("purchase_count"),
        sum("order_total").alias("total_spent"),
        avg("order_total").alias("avg_order_value"),
        collect_set("product_category").alias("categories_purchased")
    ) \
    .withColumn("spending_velocity", col("total_spent") / 1)  # Per hour

# Anomaly detection for high-value purchases
purchase_anomalies = purchase_events \
    .filter(col("order_total") > 1000) \
    .withColumn("is_weekend", dayofweek("timestamp").isin([1, 7])) \
    .withColumn("is_late_night", hour("timestamp").between(22, 6)) \
    .withColumn("anomaly_score",
                when(col("order_total") > 5000, 1.0)
                .when(col("is_weekend") & col("is_late_night"), 0.8)
                .when(col("order_total") > 2000, 0.6)
                .otherwise(0.3))

# Write to multiple sinks
def write_to_data_lake(df, epoch_id):
    """Write streaming data to data lake (Delta/Parquet)"""
    df.write \
        .mode("append") \
        .option("mergeSchema", "true") \
        .partitionBy("date", "hour") \
        .parquet(f"s3://data-lake/customer-events/")

    logging.info(f"Batch {epoch_id}: Wrote {df.count()} events to data lake")

def write_metrics_to_redis(df, epoch_id):
    """Write real-time metrics to Redis for dashboards"""
    # Convert to JSON and write to Redis
    metrics_json = df.select(
        to_json(struct("*")).alias("metrics")
    ).collect()

    import redis
    r = redis.Redis(host='localhost', port=6379, db=0)

    for row in metrics_json:
        r.setex(f"customer_metrics:{epoch_id}", 3600, row.metrics)

    logging.info(f"Batch {epoch_id}: Updated real-time metrics in Redis")

def send_alerts(df, epoch_id):
    """Send alerts for high-value anomalies"""
    high_anomalies = df.filter(col("anomaly_score") >= 0.8).collect()

    for anomaly in high_anomalies:
        alert_message = f"""
        High-value purchase anomaly detected:
        Customer: {anomaly.customer_id}
        Amount: ${anomaly.order_total}
        Time: {anomaly.timestamp}
        Anomaly Score: {anomaly.anomaly_score}
        """

        # Send to monitoring system (Slack, PagerDuty, etc.)
        logging.warning(alert_message)

# Start streaming queries
events_query = enriched_events.writeStream \
    .foreachBatch(write_to_data_lake) \
    .outputMode("append") \
    .trigger(processingTime='30 seconds') \
    .start()

metrics_query = customer_realtime_metrics.writeStream \
    .foreachBatch(write_metrics_to_redis) \
    .outputMode("update") \
    .trigger(processingTime='1 minute') \
    .start()

anomaly_query = purchase_anomalies.writeStream \
    .foreachBatch(send_alerts) \
    .outputMode("append") \
    .trigger(processingTime='10 seconds') \
    .start()

# Monitor streaming queries
logging.info("Starting streaming queries...")
events_query.awaitTermination()
```

## Validation Commands

### Data Quality Testing
```bash
# dbt data quality tests
dbt test --select models/marts/
dbt test --select models/staging/

# Great Expectations data validation
great_expectations checkpoint run customer_data_checkpoint
great_expectations checkpoint run realtime_data_checkpoint

# Data profiling and discovery
pandas-profiling customer_analytics.csv --title "Customer Analytics Profile"
```

### Pipeline Testing
```bash
# Airflow DAG validation and testing
airflow dags test customer_analytics_pipeline 2024-01-01
airflow tasks test customer_analytics_pipeline extract_customer_data 2024-01-01

# Spark job testing and validation
spark-submit --master local[4] test_streaming_pipeline.py
pyspark --conf spark.sql.streaming.checkpointLocation=/tmp/test-checkpoint

# Data lineage and dependency validation
dbt docs generate
dbt docs serve --port 8080
```

### ML Model Validation
```bash
# Model performance testing
python -m pytest tests/test_ml_models.py -v
python scripts/validate_model_performance.py --model-path /tmp/churn_model.pkl

# Feature drift detection
evidently run feature_drift_report.py --reference-data data/reference.csv --current-data data/current.csv

# Model deployment testing
mlflow models serve -m "models:/churn_prediction/production" --port 5000
curl -X POST http://localhost:5000/invocations -H 'Content-Type: application/json' -d '{"inputs": [[...]]}'
```

This data domain ensures robust, scalable data infrastructure with comprehensive analytics capabilities, ML operations, and strong data governance practices for modern data-driven organizations.
