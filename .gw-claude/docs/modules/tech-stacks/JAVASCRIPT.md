# JavaScript Technology Stack

## Modern JavaScript Development

### Language Features & Best Practices
- **ES6+ Syntax**: Use modern JavaScript features (arrow functions, destructuring, modules)
- **Async/Await**: Handle asynchronous operations with clean, readable code
- **TypeScript Integration**: Add static typing for better development experience
- **Functional Programming**: Leverage map, filter, reduce for data transformation
- **Module System**: Use ES6 modules for clean code organization

### Code Quality Standards
```javascript
// Modern async/await patterns
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

// Functional programming patterns
const processUsers = (users) => {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
};
```

## Frontend Frameworks

### React - Component-Based UI
```jsx
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserData(userId),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries(['user', userId]);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="user-profile">
      <h2>{user.fullName}</h2>
      <p>{user.email}</p>
      <button
        onClick={() => updateUserMutation.mutate({ ...user, lastSeen: new Date() })}
        disabled={updateUserMutation.isLoading}
      >
        Update Profile
      </button>
    </div>
  );
};
```

### Vue.js - Progressive Framework
```vue
<template>
  <div class="user-dashboard">
    <h2>{{ user.fullName }}</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <UserStats :stats="userStats" />
      <button @click="refreshData" :disabled="loading">
        Refresh Data
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(false);
const error = ref(null);

const user = computed(() => userStore.currentUser);
const userStats = computed(() => userStore.userStatistics);

const refreshData = async () => {
  loading.value = true;
  error.value = null;
  try {
    await userStore.fetchUserData();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  refreshData();
});
</script>
```

## Backend Development

### Node.js with Express
```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Input validation middleware
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
];

// API endpoints
app.post('/api/users', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = await createUser(req.body);
    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Build Tools & Development

### Vite - Fast Build Tool
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@emotion/react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### Webpack Configuration
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

## Testing Framework

### Jest & Testing Library
```javascript
// User.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UserProfile', () => {
  test('displays user information correctly', async () => {
    const mockUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
    };

    // Mock the API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );

    render(<UserProfile userId={1} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  test('handles update button click', async () => {
    render(<UserProfile userId={1} />, { wrapper: createWrapper() });

    const updateButton = await screen.findByText('Update Profile');
    fireEvent.click(updateButton);

    expect(updateButton).toBeDisabled();
  });
});
```

## Package Management

### NPM/Yarn Configuration
```json
{
  "name": "modern-js-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^4.32.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.4",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.0",
    "@testing-library/react": "^13.4.0"
  }
}
```

## Validation Commands

```bash
# Linting and formatting
npm run lint
npm run lint:fix
npm run format

# Testing
npm test
npm run test:watch

# Build and preview
npm run build
npm run preview

# Security audit
npm audit
npm audit fix
```

This JavaScript stack provides comprehensive coverage for modern web development with focus on performance, maintainability, and developer experience.
