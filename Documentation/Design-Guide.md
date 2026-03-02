# Design Guide

## Overview

Comprehensive design system built on Tailwind CSS v4 with custom components, consistent spacing, typography, and color schemes supporting light and dark themes.

## Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Mobile-first approach
- **Theming**: Seamless light/dark mode support
- **Performance**: Optimized CSS with minimal bundle impact

## Theme System

### Features
- ✅ **Light/Dark Mode Toggle** with persistent storage
- ✅ **Smooth Transitions** for theme changes
- ✅ **Consistent Design** across all components
- ✅ **Accessibility** with proper contrast ratios

### Usage
```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}
```

### Theme Toggle Component
```typescript
import { ThemeToggle } from "solstice-ui";
import { useTheme } from "@/hooks/ui/useTheme";

function Layout() {
  const { theme, toggleTheme } = useTheme();
  return <ThemeToggle theme={theme} onToggle={toggleTheme} />;
}
```

## Color System

### Light Theme
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: White (#FFFFFF)
- **Surface**: Gray-50 (#F9FAFB)

### Dark Theme
- **Primary**: Blue (#60A5FA)
- **Secondary**: Gray (#9CA3AF)
- **Success**: Green (#34D399)
- **Warning**: Yellow (#FBBF24)
- **Error**: Red (#F87171)
- **Background**: Gray-900 (#111827)
- **Surface**: Gray-800 (#1F2937)

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Text Sizes
- **xs**: 12px (0.75rem)
- **sm**: 14px (0.875rem)
- **base**: 16px (1rem)
- **lg**: 18px (1.125rem)
- **xl**: 20px (1.25rem)
- **2xl**: 24px (1.5rem)
- **3xl**: 30px (1.875rem)

## Spacing System

### Spacing Scale
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)

## Component Library

### Core Components

#### Button, Input, Card, Dialog
These come from **solstice-ui**. Import from `"solstice-ui"`:

```typescript
import { Button, Input, Card, Dialog } from "solstice-ui";

<Button variant="primary" size="md">Click Me</Button>
<Input type="text" placeholder="Enter text" error="Error message" />
<Card title="Title">Content</Card>
<Dialog isOpen={isOpen} onClose={onClose} title="Modal">...</Dialog>
```

See the solstice-ui library for variants, sizes, and full API.

#### TabNavigation
```typescript
import { TabNavigation } from "solstice-ui";
import type { TabItem } from "solstice-ui";

const tabs: TabItem[] = [
  { id: "all", label: "All Items", icon: List },
  { id: "pending", label: "Pending", icon: Clock, permission: "items:approve" },
  { id: "archived", label: "Archived", icon: Archive, isVisible: showArchived },
];

<TabNavigation
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  hasPermission={hasPermission}
  variant="default"    // "default" | "pills" | "underline"
  size="md"            // "sm" | "md" | "lg"
/>
```

**Props:** `tabs` (TabItem[]), `activeTab`, `onTabChange`, `hasPermission` (optional), `variant`, `size`, `testId`. **TabItem**: `id`, `label`, `icon?`, `permission?`, `isVisible?`, `disabled?`, `badge?`, `testId?`. See solstice-ui for full definitions.

### Layout Components

#### Layout (app component)
```typescript
import { Layout } from "@/components";

<Layout>
  <Outlet />  {/* or page content */}
</Layout>
```
Layout includes sidebar, header, theme toggle, and user menu.

#### PageHeader (solstice-ui)
```typescript
import { PageHeader, Button } from "solstice-ui";

<PageHeader 
  title="Page Title"
  description="Page description"
  icon={SomeIcon}
/>
```

## CSS Classes

### Theme Classes
```css
/* Light theme */
.light { /* light theme styles */ }

/* Dark theme */
.dark { /* dark theme styles */ }

/* Theme transitions */
.theme-transition { transition: all 0.3s ease; }
```

### Utility Classes
```css
/* Spacing */
.p-xs { padding: 0.25rem; }
.p-sm { padding: 0.5rem; }
.p-md { padding: 1rem; }

/* Colors */
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); }

/* Responsive */
.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 768px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
```css
/* Mobile styles (default) */
.component { /* mobile styles */ }

/* Tablet and up */
@media (min-width: 768px) {
  .component { /* tablet styles */ }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { /* desktop styles */ }
}
```

## Accessibility

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **Interactive Elements**: 3:1 minimum ratio

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
```typescript
<button aria-label="Close modal">
  <CloseIcon aria-hidden="true" />
</button>
```

## Animation & Transitions

### Transition Classes
```css
.transition-fast { transition: all 0.15s ease; }
.transition-normal { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }
```

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## Best Practices

### Component Design
- Keep components small and focused
- Use consistent prop interfaces
- Implement proper TypeScript types
- Follow accessibility guidelines

### Styling
- Use CSS custom properties for theming
- Implement responsive design patterns
- Optimize for performance
- Maintain consistent spacing

### Theme Implementation
- Test both light and dark themes
- Ensure proper contrast ratios
- Use semantic color names
- Implement smooth transitions

---

*For development information, see [Development Guide](./Development-Guide.md)*