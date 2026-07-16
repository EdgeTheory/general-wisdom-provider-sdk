# Frontend Persona Guidelines

## Frontend-Focused Development Patterns

When the system detects frontend-related keywords or the frontend persona is selected, follow these specialized frontend patterns and practices.

## Core Frontend Principles

### User Experience First
- Design with user needs and accessibility in mind
- Implement responsive design for all screen sizes
- Optimize for performance and loading speeds
- Follow established UX/UI design patterns

### Accessibility Standards
- Follow WCAG 2.1 AA guidelines minimum
- Implement proper semantic HTML structure
- Ensure keyboard navigation support
- Test with screen readers and assistive technologies

### Progressive Enhancement
- Build core functionality for all users first
- Enhance experience for modern browsers
- Implement graceful degradation
- Test across different devices and capabilities

## Frontend Technology Patterns

### Modern JavaScript/TypeScript
```typescript
// Component architecture patterns
interface ComponentProps {
  data: DataType;
  onAction: (action: ActionType) => void;
}

const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // Use hooks for state management
  const [state, setState] = useState<StateType>(initialState);

  // Memoize expensive calculations
  const computedValue = useMemo(() =>
    expensiveCalculation(data), [data]
  );

  // Handle side effects properly
  useEffect(() => {
    // Cleanup functions for subscriptions
    return () => cleanup();
  }, []);

  return (
    <div role="main" aria-label="Component description">
      {/* Semantic HTML with proper ARIA attributes */}
    </div>
  );
};
```

### CSS and Styling Best Practices
```css
/* Mobile-first responsive design */
.component {
  /* Base styles for mobile */
  padding: 1rem;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
    padding: 2rem;
    font-size: 1.25rem;
  }
}

/* CSS custom properties for theming */
:root {
  --primary-color: hsl(210, 50%, 50%);
  --secondary-color: hsl(210, 30%, 70%);
  --text-color: hsl(0, 0%, 20%);
  --background-color: hsl(0, 0%, 98%);
}
```

## Frontend Validation Patterns

### Frontend-Specific Validation Commands
```bash
# Linting and code quality
eslint --fix --ext .js,.jsx,.ts,.tsx .  # JavaScript/TypeScript linting
stylelint "**/*.css" --fix              # CSS linting
prettier --write "**/*.{js,jsx,ts,tsx,css,html}" # Code formatting

# Accessibility testing
axe-cli http://localhost:3000           # Accessibility testing
pa11y http://localhost:3000             # Accessibility auditing

# Performance testing
lighthouse http://localhost:3000 --output json # Performance audit
bundlesize                              # Bundle size monitoring

# Cross-browser testing
playwright test                         # Cross-browser testing
```

### Frontend Quality Checklist
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified
- [ ] **Performance**: Core Web Vitals meet standards
- [ ] **Responsive Design**: Works across all screen sizes
- [ ] **Cross-Browser**: Tested in major browsers
- [ ] **SEO**: Meta tags and semantic HTML implemented
- [ ] **Security**: XSS protection and CSP headers
- [ ] **Bundle Size**: JavaScript bundles optimized
- [ ] **Loading States**: Proper loading and error states

## Component Architecture Patterns

### Component Design Principles
- Single responsibility principle for components
- Composition over inheritance
- Props interface design for reusability
- Proper state management patterns

### State Management
```typescript
// Context for global state
const AppContext = createContext<AppState>({});

// Custom hooks for state logic
const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await api.getUser(id);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, fetchUser };
};
```

### Form Handling Patterns
```typescript
// Form validation and handling
const useForm = <T>(
  initialValues: T,
  validationSchema: ValidationSchema<T>
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<T>>({});

  const validate = useCallback((values: T) => {
    return validationSchema.validate(values);
  }, [validationSchema]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
    return (e: FormEvent) => {
      e.preventDefault();
      const validationResult = validate(values);
      if (validationResult.isValid) {
        onSubmit(values);
      } else {
        setErrors(validationResult.errors);
      }
    };
  }, [values, validate]);

  return { values, errors, touched, handleSubmit };
};
```

## MCP Integration for Frontend

### Magic MCP for UI Components
Use Magic MCP server for:
- React component generation
- CSS framework integration
- Responsive design templates
- Accessibility pattern implementation

### Context7 for Frontend Research
Use Context7 MCP server for:
- Framework documentation lookup
- Best practices research
- Browser compatibility information
- Performance optimization techniques

## Performance Optimization

### Core Web Vitals Optimization
- **Largest Contentful Paint (LCP)**: Optimize images and critical resources
- **First Input Delay (FID)**: Minimize JavaScript execution time
- **Cumulative Layout Shift (CLS)**: Prevent layout shifts

### Bundle Optimization
```javascript
// Code splitting patterns
const LazyComponent = lazy(() => import('./LazyComponent'));

// Dynamic imports for route-based splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard'))
  }
];

// Tree shaking optimization
export { specificFunction } from './utils';
```

### Image Optimization
- Use next-gen formats (WebP, AVIF)
- Implement lazy loading
- Responsive images with srcset
- Proper image sizing and compression

## Testing Strategies

### Frontend Testing Pyramid
1. **Unit Tests**: Individual component logic
2. **Integration Tests**: Component interactions
3. **End-to-End Tests**: Full user workflows

```typescript
// Component testing example
describe('UserCard Component', () => {
  it('displays user information correctly', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const onEdit = jest.fn();
    render(<UserCard user={user} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

## Frontend Anti-Patterns to Avoid

### Performance Anti-Patterns
- ❌ **Unnecessary Re-renders**: Use React.memo and useMemo appropriately
- ❌ **Large Bundle Sizes**: Implement code splitting and tree shaking
- ❌ **Blocking JavaScript**: Use async/defer for non-critical scripts
- ❌ **Unoptimized Images**: Always optimize and size images properly

### Accessibility Anti-Patterns
- ❌ **Missing Alt Text**: Always provide alternative text for images
- ❌ **Non-Semantic HTML**: Use proper HTML elements for their purpose
- ❌ **Poor Color Contrast**: Ensure sufficient color contrast ratios
- ❌ **Keyboard Inaccessible**: All interactive elements must be keyboard accessible

### Code Quality Anti-Patterns
- ❌ **Prop Drilling**: Use context or state management for deep props
- ❌ **Inline Styles**: Use CSS classes or styled-components
- ❌ **Hardcoded Values**: Use constants and configuration
- ❌ **Mixed Concerns**: Keep styling, logic, and markup properly separated

## Modern Frontend Architecture

### Micro-Frontend Patterns
- Module federation for independent deployments
- Shared component libraries
- Consistent design systems
- Independent team ownership

### JAMstack Architecture
- Static site generation (SSG)
- Client-side hydration
- API-based content management
- CDN-first deployment strategy
