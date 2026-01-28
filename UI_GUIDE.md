# 🎨 UI/UX Guide - Component Overview

## App Layout

```
┌────────────────────────────────────────────────────────┐
│                  📄 HEADER                             │
│   Engagement Report Generator    [Logout] (if auth)   │
├────────────────────┬─────────────────────────────────┤
│                    │                                   │
│   SIDEBAR          │  MAIN CONTENT                     │
│   (280px fixed)    │  (Flexible)                       │
│                    │                                   │
│  ⚙️ Configuration  │  📝 Form or                       │
│  📅 Date Format    │     Empty State                   │
│  🔢 Decimal Places │                                   │
│  1️⃣ Select Template│     [🔍 Load Fields]             │
│  2️⃣ Output Format  │                                   │
│                    │  📋 Template Fields              │
│  ℹ️ Tag Guide      │  [Form Inputs Grid]              │
│  - {x}             │                                   │
│  - {{x}}           │  [🚀 Generate Report]            │
│  - {{{x}}}         │                                   │
│  - Dropdowns       │                                   │
└────────────────────┴─────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo Section
│   └── User Info (when authenticated)
├── Sidebar
│   ├── Date Format Selector
│   ├── Decimal Places Selector
│   ├── Template Category Selector
│   ├── Output Format Radio
│   └── Tag Guide Info
└── Main
    ├── Title (Selected Category)
    └── TemplateForm
        ├── Form Title
        ├── Field Count Info
        ├── Fields Grid (2 columns)
        │   ├── Text Input
        │   ├── Text Area (for long fields)
        │   ├── Number Input
        │   ├── Date Picker
        │   └── Select Dropdown
        └── Submit Button
```

## Colors & Typography

### Color Palette
```
Primary:     #667eea (Purple-Blue)
Secondary:   #764ba2 (Deep Purple)
Text:        #333333 (Dark Gray)
Text Light:  #666666 (Medium Gray)
Text Lighter: #999999 (Light Gray)
Background:  #f5f5f5 (Off-White)
Borders:     #e0e0e0 (Light Gray)
Success:     Green (in alerts)
Warning:     Orange (in alerts)
Error:       Red (in alerts)
```

### Typography
```
Font Family: System fonts (-apple-system, Segoe UI, etc.)
H1: 2rem, bold
H2: 1.5rem, semibold
H3: 1.1rem, semibold
Body: 0.95rem, normal
Caption: 0.85rem, normal
```

## Component Styles

### Header
- Gradient background (purple to darker purple)
- White text
- Sticky positioning
- Box shadow
- Responsive: Stacks on mobile

### Sidebar
- Light gray background
- Fixed width (280px)
- Scrollable on tall content
- Border right on desktop
- Responsive: Full width on mobile

### Form
- 2-column grid layout
- Responsive: 1 column on mobile
- Consistent spacing (2rem margins)
- Input focus states with color change

### Buttons
- Gradient background (primary color)
- White text
- Hover effects (lift + shadow)
- Disabled state (opacity 0.6)
- Full width on submit

### Inputs
- 0.6-0.7rem padding
- 1px border
- Rounded corners (4px)
- Focus state with color + shadow
- Placeholder text in gray

### Select
- 100% width
- Similar styling to inputs
- Dropdown arrow
- Hover and focus states

### TextArea
- Minimum 100px height
- Resize vertical
- Same styling as inputs

## Responsive Breakpoints

```
Mobile:   < 768px
Desktop:  >= 768px

Changes:
- Sidebar: Full width on mobile
- Grid: 1 column on mobile, 2 on desktop
- Header: Stacks vertically on mobile
- Buttons: Adjust padding/size on mobile
```

## Form Field Types

### Text Input
```
📝 Field Name
[Text input box]
- Single line
- For short text
```

### Text Area
```
📝 Address
[Large text box - multiline]
- Minimum 4 rows
- For long text
- Enforces 50 word limit
- Shows word count
```

### Number Input
```
🔢 Cost
[Number input box]
- Min: 0
- Step: 0.01
- Formatted with decimals
```

### Date Picker
```
📅 Date
[Date picker calendar]
- Browser native
- Selected format applied in output
```

### Dropdown
```
📋 Type
[Select dropdown]
- Shows cleaned options (no quotes)
- Default: "Select an option..."
```

## Interactive States

### Hover States
- Buttons: Color deepens, shadow appears
- Inputs: Border color changes to primary
- Links: Underline appears

### Focus States
- Inputs: Border color + box-shadow
- Buttons: Visual feedback
- Keyboard navigation supported

### Disabled States
- Inputs: opacity 0.5, cursor not-allowed
- Buttons: opacity 0.6, cursor not-allowed
- Form: Disable submit until filled

### Loading States
- Button text: "⏳ Generating Report..."
- Button disabled
- Form inputs disabled
- Spinner in progress (implicit)

### Error States
- Error banner (red background, dark red text)
- Field validation on empty fields
- Alert dialogs for failures

## Accessibility Features

- ✅ Semantic HTML
- ✅ Proper labels for inputs
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)
- ✅ Focus indicators
- ✅ ARIA attributes where needed
- ✅ Form validation messages

## Animation & Transitions

```
Buttons:    300ms ease on hover/click
Inputs:     300ms ease on focus
Colors:     300ms ease on state change
Shadows:    300ms ease on hover
```

## Icon Usage

```
📄  - Document/Header
⚙️  - Settings/Configuration
📅  - Date/Calendar
🔢  - Numbers
📝  - Text
📋  - Dropdown/Select
✅  - Success
⚠️  - Warning
❌  - Error
🔍  - Search/Load
🚀  - Generate/Launch
📥  - Download
💡  - Tip/Info
👈  - Direction
👆  - Call to action
```

## Dark Mode Considerations

Current: Light mode only

To add dark mode:
1. Add CSS variables for colors
2. Create dark theme variants
3. Use `prefers-color-scheme` media query
4. Update component classes

## Print Styles

Generated documents are downloaded, not printed.
If needed, add print stylesheet for preview.

## Performance Optimizations

- CSS Modules: No class name conflicts
- Component splitting: Lazy loading potential
- Image optimization: Icons as Unicode/emojis
- Minimal dependencies: Only essentials
- Fast HMR: Instant updates in dev

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Accessibility Checklist

- [x] Semantic HTML used
- [x] Labels connected to inputs
- [x] Keyboard navigation works
- [x] Color not only indicator
- [x] Focus visible
- [x] Text contrast >4.5:1
- [x] No auto-playing media
- [x] Forms have submit buttons
- [ ] ARIA labels (optional enhancement)
- [ ] Screen reader tested (optional)

---

## UI Component Props Reference

### Header Component
```typescript
interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
}
```

### Sidebar Component
```typescript
interface SidebarProps {
  onCategorySelect: (category: string) => void;
  onDateFormatChange: (format: string) => void;
  onDecimalPlacesChange: (places: number) => void;
  selectedCategory?: string;
  selectedDateFormat?: string;
  selectedDecimalPlaces?: number;
}
```

### TemplateForm Component
```typescript
interface TemplateFormProps {
  fields: TemplateField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  selectedDateFormat: string;
  selectedDecimalPlaces: number;
  isLoading?: boolean;
}
```

---

**This guide covers all visual and interactive elements of the application.**
