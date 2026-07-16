# Frontend Domain Context

## When This Module Loads

**Trigger Keywords**: frontend, ui, ux, react, vue, angular, component, accessibility, responsive, browser

**Intent Patterns**: ui_development, component_creation, frontend_optimization, user_experience

**Tools Predicted**: component libraries, build tools, testing frameworks, accessibility tools

## Frontend Development Principles

### User-Centered Design
- **Accessibility First**: WCAG 2.1 AA compliance as baseline requirement
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Performance Budget**: Core Web Vitals optimization (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Cross-Browser Compatibility**: Support for latest 2 versions of major browsers

### Component-Driven Development
- **Atomic Design**: Build reusable components following atomic design principles
- **Design Systems**: Consistent UI patterns and style guides
- **State Management**: Predictable data flow with proper state architecture
- **Component Testing**: Unit and integration tests for all components
- **Documentation**: Interactive component documentation and style guides

### Modern Development Practices
- **Build Optimization**: Code splitting, lazy loading, and bundle optimization
- **Type Safety**: TypeScript for large applications with proper typing
- **Development Experience**: Hot reloading, debugging tools, and development servers
- **Code Quality**: ESLint, Prettier, and automated formatting
- **Version Control**: Git workflows with proper branching strategies

## Frontend Implementation Patterns

### React Component Architecture
```tsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

const UserProfile = memo<UserProfileProps>(({ userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      onUpdate?.(updatedUser);
      setIsEditing(false);
    },
  });

  const handleSave = useCallback(async (userData: Partial<User>) => {
    if (!user) return;

    try {
      await updateMutation.mutateAsync({
        ...user,
        ...userData,
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }, [user, updateMutation]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-8"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="sr-only">Loading user profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-md p-4"
        role="alert"
      >
        <h3 className="text-red-800 font-medium">Error Loading Profile</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            User Profile
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {isEditing ? (
          <UserProfileForm
            user={user}
            onSave={handleSave}
            isSubmitting={updateMutation.isLoading}
          />
        ) : (
          <UserProfileDisplay user={user} />
        )}
      </div>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';
```

### Vue.js Composition API
```vue
<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>{{ pageTitle }}</h1>
      <nav aria-label="Dashboard navigation">
        <ul class="nav-list">
          <li v-for="item in navigation" :key="item.id">
            <router-link
              :to="item.route"
              :aria-current="isCurrentRoute(item.route) ? 'page' : undefined"
              class="nav-link"
            >
              <component :is="item.icon" class="nav-icon" />
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <main class="dashboard-content">
      <Suspense>
        <template #default>
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </template>
        <template #fallback>
          <div class="loading-container" role="status" aria-live="polite">
            <div class="loading-spinner" />
            <span class="sr-only">Loading content...</span>
          </div>
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAccessibility } from '@/composables/useAccessibility';

interface NavigationItem {
  id: number;
  label: string;
  route: string;
  icon: string;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { announceRouteChange } = useAccessibility();

const pageTitle = computed(() => {
  return route.meta?.title || 'Dashboard';
});

const navigation: NavigationItem[] = [
  { id: 1, label: 'Overview', route: '/dashboard', icon: 'HomeIcon' },
  { id: 2, label: 'Analytics', route: '/analytics', icon: 'ChartIcon' },
  { id: 3, label: 'Settings', route: '/settings', icon: 'SettingsIcon' },
];

const isCurrentRoute = (routePath: string): boolean => {
  return route.path === routePath;
};

// Announce route changes for screen readers
watch(() => route.path, (newPath) => {
  const currentPage = navigation.find(item => item.route === newPath);
  if (currentPage) {
    announceRouteChange(`Navigated to ${currentPage.label}`);
  }
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: var(--color-background);
}

.dashboard-header {
  background: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-list {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 1rem 0 0 0;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link:focus {
  background-color: rgba(255, 255, 255, 0.1);
  outline: 2px solid white;
  outline-offset: 2px;
}

.nav-link[aria-current="page"] {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.dashboard-content {
  padding: 2rem;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-primary-light);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
  }

  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style>
```

### Performance Optimization Patterns
```javascript
// Code splitting and lazy loading
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Analytics = lazy(() => import('./Analytics'));

// Image optimization component
const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <picture>
      <source srcSet={`${src}.avif`} type="image/avif" />
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </picture>
  );
};

// Intersection Observer hook for lazy loading
const useLazyLoad = (callback, options = {}) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, ...options });

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, callback]);

  return setRef;
};

// Virtual scrolling for large lists
const VirtualList = ({ items, itemHeight, containerHeight }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  };

  return (
    <div
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            <ListItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Quality Standards

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: Minimum accessibility standard
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Focus Management**: Visible focus indicators and logical tab order

### Performance Standards
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: Main bundle < 250KB gzipped
- **Time to Interactive**: < 3.5s on 3G networks
- **First Contentful Paint**: < 1.5s
- **Progressive Enhancement**: Works without JavaScript

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Graceful Degradation**: Fallbacks for unsupported features
- **Feature Detection**: Use feature detection, not browser detection

## Validation Commands

### Development Testing
```bash
# Accessibility testing
npm run test:a11y
lighthouse --only-categories=accessibility http://localhost:3000

# Performance testing
npm run build
npm run analyze
lighthouse --only-categories=performance http://localhost:3000

# Cross-browser testing
npm run test:cross-browser
playwright test --project=chromium,firefox,webkit

# Visual regression testing
npm run test:visual
percy exec -- npm run storybook:test
```

### Build and Deployment
```bash
# Production build
npm run build
npm run test:build

# Bundle analysis
webpack-bundle-analyzer dist/static/js/*.js

# Performance monitoring
npm run lighthouse:ci
web-vitals --reporter=json
```

This frontend domain ensures exceptional user experiences through accessible, performant, and well-architected user interfaces that work seamlessly across all devices and user needs.
