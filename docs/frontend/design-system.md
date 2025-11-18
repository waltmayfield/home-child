# Design System Guide - shadcn/ui

This document provides a comprehensive guide for using shadcn/ui as the design system for this Next.js application.

## Overview

[shadcn/ui](https://ui.shadcn.com/) is a collection of reusable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, shadcn/ui provides copy-paste components that you own and can customize freely.

## Key Benefits

- **Copy-paste approach**: You own the component code
- **Built on Radix UI**: Excellent accessibility out of the box
- **Tailwind CSS integration**: Highly customizable styling
- **TypeScript-first**: Full type safety
- **Zero runtime overhead**: Components are compiled, not shipped as a library
- **Excellent Next.js integration**: Works seamlessly with App Router

## Getting Started

### Prerequisites

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS

### Installation

1. Install required dependencies:
```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

2. Initialize shadcn/ui:
```bash
npx shadcn@latest init
```

3. Add components as needed:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── custom/              # Your custom components
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
```

## Using Components

### Basic Usage

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Component Variants

Most components come with built-in variants:

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Customization

### Theming

Colors and other design tokens are managed through CSS variables in your `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variables */
}
```

### Customizing Components

Since you own the component code, you can modify them directly in `src/components/ui/`:

```tsx
// src/components/ui/button.tsx
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Add your custom variant
        custom: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
      },
    },
  }
)
```

## Available Components

### Form Components
- **Button** - Various button styles and sizes
- **Input** - Text inputs with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean input
- **Radio Group** - Single selection from options
- **Switch** - Toggle switch
- **Slider** - Range input
- **Form** - Form validation with react-hook-form

### Layout Components
- **Card** - Container with header, content, and footer
- **Sheet** - Slide-out panel
- **Dialog** - Modal dialogs
- **Drawer** - Mobile-friendly drawer
- **Tabs** - Tab navigation
- **Accordion** - Collapsible content
- **Separator** - Horizontal/vertical dividers

### Navigation Components
- **Navigation Menu** - Complex navigation menus
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation
- **Command** - Command palette/search

### Data Display
- **Table** - Data tables
- **Badge** - Status indicators
- **Avatar** - User profile images
- **Tooltip** - Contextual information
- **Popover** - Floating content
- **Alert** - Important messages
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders

### Utility Components
- **Scroll Area** - Custom scrollbars
- **Resizable** - Resizable panels
- **Context Menu** - Right-click menus
- **Dropdown Menu** - Action menus
- **Hover Card** - Hover-triggered cards
- **Calendar** - Date picker
- **Date Picker** - Date selection

## Best Practices

### 1. Use the `cn` Utility
Always use the `cn` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils"

<Button className={cn("custom-class", isActive && "active-state")}>
  Button
</Button>
```

### 2. Extend Components
Create wrapper components for consistent styling:

```tsx
// src/components/custom/primary-button.tsx
import { Button } from "@/components/ui/button"

export function PrimaryButton({ children, ...props }) {
  return (
    <Button className="bg-brand-primary hover:bg-brand-primary/90" {...props}>
      {children}
    </Button>
  )
}
```

### 3. Use Composition
Combine multiple components for complex UIs:

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Settings</CardTitle>
      <Button variant="outline" size="sm">
        Edit
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <Form>
      {/* Form content */}
    </Form>
  </CardContent>
</Card>
```

## Dark Mode

shadcn/ui supports dark mode out of the box. Use `next-themes` for theme switching:

```bash
npm install next-themes
```

```tsx
// app/providers.tsx
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

## Useful Links

### Official Resources
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/examples)
- [Installation Guide](https://ui.shadcn.com/docs/installation/next)
- [Theming Guide](https://ui.shadcn.com/docs/theming)

### Dependencies
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Icon library
- [Class Variance Authority](https://cva.style/) - Component variant management

### Tools & Extensions
- [shadcn/ui CLI](https://ui.shadcn.com/docs/cli) - Command line interface
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [Figma Kit](https://www.figma.com/community/file/1203061493325953101) - Design system for Figma

### Community & Examples
- [GitHub Repository](https://github.com/shadcn-ui/ui)
- [Discord Community](https://discord.gg/shadcn-ui)
- [Example Applications](https://ui.shadcn.com/examples)
- [Component Blocks](https://ui.shadcn.com/blocks) - Pre-built sections

## Troubleshooting

### Common Issues

1. **Components not styled correctly**
   - Ensure Tailwind CSS is properly configured
   - Check that CSS variables are defined in `globals.css`

2. **TypeScript errors**
   - Make sure all required dependencies are installed
   - Check that `@types/node` and `@types/react` are up to date

3. **Import path issues**
   - Verify `tsconfig.json` has the correct path mapping for `@/*`
   - Ensure `components.json` points to the correct directories

### Getting Help

- Check the [FAQ](https://ui.shadcn.com/docs/faq)
- Search [GitHub Issues](https://github.com/shadcn-ui/ui/issues)
- Ask in the [Discord community](https://discord.gg/shadcn-ui)

---

## Contributing to This Documentation

This documentation should be updated when:
- New components are added to the project
- Custom variants or themes are created
- Best practices evolve
- New team members need onboarding

For questions or updates, please reach out to the frontend team.