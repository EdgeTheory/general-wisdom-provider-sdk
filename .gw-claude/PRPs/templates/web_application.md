name: "Web Application PRP Template - Frontend/Backend with Responsive Design Standards"
description: |
  Comprehensive PRP template for web applications including frontend, backend, and full-stack projects.
  Supports both greenfield and brownfield scenarios with responsive design and performance optimization.

---

## Goal

**Feature Goal**: [Specific web application functionality - dashboard, e-commerce site, admin panel, etc.]

**Deliverable**: [Complete web application with frontend, backend API, and deployment configuration]

**Success Definition**:
- Responsive design works across all device sizes (mobile, tablet, desktop)
- Core Web Vitals meet performance benchmarks (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Accessibility compliance (WCAG 2.1 AA minimum)
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [Additional success criteria specific to the application]

## User Persona

**Target User**: [Specific user type - end users, administrators, customers, etc.]

**Use Case**: [Primary scenarios when users interact with the web application]

**User Journey**: [Complete user workflow from landing to completion of primary tasks]

**Pain Points Addressed**: [Specific user frustrations this web application solves]

## Why

- [Business value and user impact specific to web presence]
- [Integration with existing web ecosystem or services]
- [Problems this web application solves and target audience]
- [Competitive advantages and unique value proposition]

## What

[User-visible web application behavior, UI/UX requirements, and technical specifications]

### Success Criteria

- [ ] Frontend renders correctly on all target devices and browsers
- [ ] API endpoints respond within acceptable time limits
- [ ] User authentication and authorization work securely
- [ ] Data persistence and retrieval functions properly
- [ ] Responsive design adapts to different screen sizes
- [ ] Accessibility standards met for all interactive elements
- [ ] Performance benchmarks achieved for all critical user flows
- [ ] [Additional project-specific criteria]

## All Needed Context

### Context Completeness Check

_Before implementing this web application, validate: "If someone knew nothing about web development or this codebase, would they have everything needed to build a production-ready web application successfully?"_

### Brownfield Web App Considerations
- **Existing Frontend Framework**: [React, Vue, Angular version and setup]
- **Current Build System**: [Webpack, Vite, Parcel configuration and scripts]
- **Existing Component Library**: [Design system, UI components, styling approach]
- **Current State Management**: [Redux, Context, Zustand, or other state solution]
- **Existing Authentication**: [Auth provider, session management, user roles]
- **Current Routing**: [React Router, Next.js routing, or other routing solution]
- **Existing Backend Integration**: [API structure, data fetching patterns]
- **Current Deployment**: [Hosting platform, CI/CD pipeline, environment setup]

### Documentation & References

```yaml
# Web Development Standards
- url: https://web.dev/vitals/
  why: Core Web Vitals performance standards and measurement techniques
  critical: Performance optimization strategies and acceptable benchmarks

- url: https://www.w3.org/WAI/WCAG21/quickref/
  why: Accessibility guidelines and compliance requirements
  section: Level AA compliance checklist and implementation patterns

# Framework-Specific Documentation
- url: [React/Vue/Angular official docs URL with specific sections]
  why: [Component patterns, state management, routing approaches]
  critical: [Performance optimization, code splitting, lazy loading]

# Backend Integration Patterns
- file: src/api/[existing_api_pattern].js
  why: Established API client patterns and error handling
  pattern: HTTP client setup, request/response transformation
  gotcha: Authentication token management and refresh patterns

# Styling and Design System
- file: src/styles/[existing_theme].css
  why: Design tokens, color palette, typography scale
  pattern: CSS variable usage, responsive breakpoints
  gotcha: Browser compatibility issues and fallback strategies

# Authentication Patterns
- file: src/auth/[auth_service].js
  why: User authentication flow and session management
  pattern: Login/logout flow, route protection, role-based access
  gotcha: Token storage security and refresh token handling
```

### Current Codebase Tree

```bash
# Run `tree -I 'node_modules|dist|build' -L 3` to understand existing structure
```

### Desired Web Application Structure

```bash
src/
├── components/              # Reusable UI components
│   ├── common/             # Shared components (buttons, inputs, modals)
│   ├── layout/             # Layout components (header, footer, sidebar)
│   └── feature/            # Feature-specific components
├── pages/                  # Page-level components or views
├── services/               # API clients and external service integrations
├── hooks/                  # Custom React hooks or composables
├── utils/                  # Helper functions and utilities
├── styles/                 # Global styles, themes, and design tokens
├── assets/                 # Static assets (images, icons, fonts)
├── context/                # State management (Context API, stores)
└── types/                  # TypeScript type definitions

backend/ (if full-stack)
├── api/                    # API routes and controllers
├── models/                 # Data models and database schemas
├── middleware/             # Request/response middleware
├── services/               # Business logic services
└── config/                 # Configuration and environment setup

config/
├── build/                  # Build configuration (Webpack, Vite, etc.)
├── deploy/                 # Deployment scripts and configuration
└── env/                    # Environment-specific configurations
```

### Known Web Development Gotchas & Framework Quirks

```python
# CRITICAL: React requires keys for list items to prevent rendering issues
# CRITICAL: Vue 3 composition API requires reactive() for object reactivity
# CRITICAL: CSS-in-JS solutions may cause flash of unstyled content

# Performance Gotchas
# Bundle size optimization - code splitting at route level required
# Image optimization - use next/image or similar lazy loading solutions
# Font loading - preload critical fonts, use font-display: swap

# Browser Compatibility
# CSS Grid requires fallbacks for IE11 if support needed
# Fetch API requires polyfill for older browsers
# ES6+ features need transpilation for broader compatibility

# SEO Considerations
# Server-side rendering or static generation required for SEO
# Meta tags and Open Graph data must be dynamically generated
# Structured data markup needed for rich search results
```

## Implementation Blueprint

### Data Models and API Structure

Create frontend data models and API integration patterns for type safety and consistency.

```typescript
// Frontend data models (TypeScript)
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// API client patterns
class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Implementation with error handling
  }
}

// Backend models (if full-stack)
// Pydantic models for API validation
// Database ORM models
// GraphQL schemas (if using GraphQL)
```

### Implementation Tasks (Web Application Specific)

```yaml
Task 1: CREATE src/components/layout/Layout.jsx
  - IMPLEMENT: Main layout component with responsive navigation
  - FOLLOW pattern: Existing layout components or create from design system
  - FEATURES: Header, footer, sidebar (if applicable), main content area
  - RESPONSIVE: Mobile-first design with appropriate breakpoints
  - PLACEMENT: Layout components directory

Task 2: CREATE src/pages/[FeaturePage].jsx
  - IMPLEMENT: Main page components for primary user flows
  - FOLLOW pattern: Existing page structure and routing conventions
  - FEATURES: Page-specific content, data fetching, state management
  - ACCESSIBILITY: Proper heading hierarchy, focus management
  - PLACEMENT: Pages or views directory

Task 3: CREATE src/components/[FeatureName]/[Component].jsx
  - IMPLEMENT: Feature-specific UI components
  - FOLLOW pattern: Component composition and props interface design
  - FEATURES: Reusable, testable components with proper prop types
  - STYLING: Consistent with design system and responsive design
  - PLACEMENT: Feature-specific components directory

Task 4: CREATE src/services/api.js
  - IMPLEMENT: API client with authentication and error handling
  - FOLLOW pattern: Existing API integration patterns
  - FEATURES: HTTP client, request/response interceptors, error handling
  - SECURITY: Proper token management and CSRF protection
  - PLACEMENT: Services directory for external integrations

Task 5: CREATE src/hooks/[useFeature].js
  - IMPLEMENT: Custom hooks for state management and data fetching
  - FOLLOW pattern: Existing hook patterns and naming conventions
  - FEATURES: Encapsulated state logic, loading states, error handling
  - REUSABILITY: Composable logic that can be shared across components
  - PLACEMENT: Hooks directory for reusable logic

Task 6: CREATE src/styles/[feature].css or styled components
  - IMPLEMENT: Styling for components and pages
  - FOLLOW pattern: Existing styling methodology (CSS modules, styled-components, etc.)
  - FEATURES: Responsive design, design token usage, accessibility styles
  - PERFORMANCE: Optimized CSS with minimal bundle impact
  - PLACEMENT: Styles directory or co-located with components

Task 7: CONFIGURE build/deployment pipeline
  - IMPLEMENT: Build optimization and deployment configuration
  - FOLLOW pattern: Existing build pipeline or create optimized setup
  - FEATURES: Code splitting, asset optimization, environment configuration
  - PERFORMANCE: Bundle analysis, lazy loading, caching strategies
  - PLACEMENT: Build configuration directory

Task 8: CREATE tests/[component].test.js
  - IMPLEMENT: Unit and integration tests for all components
  - FOLLOW pattern: Existing testing setup (Jest, React Testing Library, etc.)
  - COVERAGE: Component behavior, user interactions, error states
  - ACCESSIBILITY: Screen reader compatibility, keyboard navigation
  - PLACEMENT: Tests co-located with components or in tests directory
```

### Web Application Implementation Patterns

```typescript
// Component Pattern with TypeScript
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  loading?: boolean;
}

const FeatureComponent: React.FC<ComponentProps> = ({ title, onAction, loading = false }) => {
  // PATTERN: Loading states and error handling
  // ACCESSIBILITY: ARIA labels and keyboard navigation
  // RESPONSIVE: Mobile-first responsive design

  return (
    <div className="feature-component" role="main">
      {loading ? <LoadingSpinner /> : <FeatureContent />}
    </div>
  );
};

// API Integration Pattern
const useFeatureData = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PATTERN: Data fetching with error handling
    // PERFORMANCE: Cleanup and cancellation for preventing memory leaks
  }, [id]);

  return { data, loading, error };
};

// Responsive Design Pattern
const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    // RESPONSIVE: CSS Grid with automatic responsive behavior
  }
};
```

### Integration Points

```yaml
FRONTEND_BUILD:
  - bundler: "Vite/Webpack configuration for optimal performance"
  - optimization: "Code splitting, lazy loading, asset optimization"

BACKEND_API:
  - endpoints: "RESTful API design with proper HTTP status codes"
  - authentication: "JWT or session-based authentication implementation"

DATABASE:
  - frontend_state: "Local storage, session storage, or client-side caching"
  - backend_persistence: "Database integration with proper migrations"

DEPLOYMENT:
  - static_hosting: "CDN deployment for frontend assets"
  - api_hosting: "Server deployment with proper environment configuration"

SEO_OPTIMIZATION:
  - meta_tags: "Dynamic meta tag generation for social sharing"
  - structured_data: "Schema.org markup for search engine optimization"

MONITORING:
  - performance: "Real User Monitoring and Core Web Vitals tracking"
  - errors: "Client-side error reporting and logging"
```

## Validation Loop

### Level 1: Frontend Development Validation

```bash
# Linting and type checking
npm run lint                    # ESLint for JavaScript/TypeScript
npm run type-check             # TypeScript compilation check
npm run format                 # Prettier formatting

# Build validation
npm run build                  # Production build
npm run build:analyze          # Bundle size analysis

# Local development
npm run dev                    # Development server
# Expected: No build errors, hot reload working, no console errors
```

### Level 2: Component and Unit Testing

```bash
# Component testing
npm run test                   # Run all tests
npm run test:coverage          # Test coverage report
npm run test:watch             # Watch mode for development

# Visual regression testing (if configured)
npm run test:visual            # Screenshot comparison tests

# Accessibility testing
npm run test:a11y              # Automated accessibility testing

# Expected: All tests pass, coverage >80%, no accessibility violations
```

### Level 3: Integration and E2E Testing

```bash
# End-to-end testing
npm run test:e2e               # Cypress/Playwright tests
npm run test:e2e:headed        # E2E tests with browser UI

# API integration testing
npm run test:api               # Backend API integration tests

# Cross-browser testing
npm run test:browsers          # Multi-browser compatibility tests

# Performance testing
npm run lighthouse             # Lighthouse performance audit
npm run test:perf              # Performance regression tests

# Expected: All user flows work, performance benchmarks met, cross-browser compatibility
```

### Level 4: Production Readiness Validation

```bash
# Performance validation
npm run analyze                # Bundle analyzer
npm run audit                  # Security vulnerability scan

# SEO validation
npm run test:seo               # SEO meta tags and structured data

# Deployment validation
npm run build:prod             # Production build
npm run serve:prod             # Serve production build locally

# Accessibility validation
axe-core src/                  # Automated accessibility scanning
# Manual testing with screen readers

# Browser compatibility validation
# Test in target browsers (Chrome, Firefox, Safari, Edge)

# Mobile responsiveness validation
# Test on actual devices or device emulation

# Expected: Production-ready build, SEO optimized, fully accessible, responsive
```

## Final Validation Checklist

### Technical Validation (Web-Specific)

- [ ] Responsive design works on all target screen sizes
- [ ] Cross-browser compatibility verified
- [ ] Accessibility standards (WCAG 2.1 AA) met
- [ ] Performance benchmarks achieved (Core Web Vitals)
- [ ] Bundle size optimized and analyzed
- [ ] All images optimized and lazy loaded
- [ ] Fonts optimized with proper loading strategies

### Feature Validation (Web Application)

- [ ] All user flows tested end-to-end
- [ ] Form validation and error handling work properly
- [ ] Authentication and authorization function correctly
- [ ] Data persistence and synchronization working
- [ ] Real-time features (if applicable) functioning
- [ ] Offline support (if required) implemented
- [ ] Social sharing and SEO meta tags configured

### User Experience Validation

- [ ] Loading states provide appropriate feedback
- [ ] Error messages are user-friendly and actionable
- [ ] Navigation is intuitive and consistent
- [ ] UI components follow design system consistency
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility verified
- [ ] Mobile touch interactions optimized

### Production Readiness (Web Application)

- [ ] Environment configuration for production deployment
- [ ] SSL/HTTPS configured for secure connections
- [ ] CDN configured for static asset delivery
- [ ] Analytics and monitoring integrated
- [ ] Error tracking and logging configured
- [ ] Backup and recovery procedures documented

---

## Web Application Anti-Patterns to Avoid

### Performance Anti-Patterns
- ❌ Don't load all JavaScript upfront - implement code splitting
- ❌ Don't ignore image optimization - use modern formats and lazy loading
- ❌ Don't skip font optimization - preload critical fonts
- ❌ Don't ignore bundle size - analyze and optimize regularly

### Accessibility Anti-Patterns
- ❌ Don't rely solely on color for information conveyance
- ❌ Don't skip keyboard navigation support
- ❌ Don't ignore screen reader compatibility
- ❌ Don't use non-semantic HTML elements

### Security Anti-Patterns
- ❌ Don't store sensitive data in localStorage
- ❌ Don't skip input validation and sanitization
- ❌ Don't ignore HTTPS in production
- ❌ Don't expose API keys in frontend code

### SEO Anti-Patterns
- ❌ Don't rely solely on client-side rendering for content
- ❌ Don't skip meta tag optimization
- ❌ Don't ignore structured data markup
- ❌ Don't forget sitemap and robots.txt configuration

### Responsive Design Anti-Patterns
- ❌ Don't design desktop-first without mobile consideration
- ❌ Don't use fixed pixel values for responsive elements
- ❌ Don't ignore touch interaction patterns on mobile
- ❌ Don't skip testing on actual devices
