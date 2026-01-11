# 🎨 Task Manager - UI/UX Design Guide

## Color Palette

### Primary Colors
```
Black:    #000000  (Buttons, Headers, Primary Actions)
White:    #FFFFFF  (Backgrounds, Cards)
Gray-50:  #f9fafb  (Page Background)
Gray-100: #f3f4f6  (Subtle Backgrounds)
Gray-900: #111827  (Dark Text)
```

### Accent Colors
```
Blue:     #3b82f6  (Links, Info)
Green:    #10b981  (Success, Completed)
Yellow:   #f59e0b  (Warning, Medium Priority)
Red:      #ef4444  (Danger, High Priority, Overdue)
```

### Status Colors
```
Pending:      Gray   (⏳)
In Progress:  Blue   (🚀)
Completed:    Green  (✅)
```

### Priority Colors
```
Low:          Green  (🟢)
Medium:       Yellow (🟡)
High:         Red    (🔴)
```

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Text Sizes
```
Heading 1:  text-3xl (30px) - Page titles
Heading 2:  text-2xl (24px) - Section headers
Heading 3:  text-xl (20px) - Card titles
Body:       text-base (16px) - Main content
Small:      text-sm (14px) - Metadata
Tiny:       text-xs (12px) - Labels, badges
```

---

## Components

### Cards
```
Background: white
Padding: 24px (p-6)
Border Radius: 12px (rounded-xl)
Shadow: 0 2px 8px rgba(0,0,0,0.08)
Hover Shadow: 0 4px 16px rgba(0,0,0,0.12)
```

### Buttons

**Primary (Black)**
```
Background: #000000
Text: white
Padding: 16px 32px
Border Radius: 8px
Hover: #1a1a1a
```

**Secondary (Gray)**
```
Background: #f3f4f6
Text: #111827
Padding: 16px 32px
Border Radius: 8px
Hover: #e5e7eb
```

### Badges

**Status Badges**
```
Pending:     bg-gray-100 text-gray-700
In Progress: bg-blue-100 text-blue-700
Completed:   bg-green-100 text-green-700
```

**Priority Badges**
```
Low:    bg-green-100 text-green-700
Medium: bg-yellow-100 text-yellow-700
High:   bg-red-100 text-red-700
```

---

## Layout

### Dashboard Grid
```
Desktop (lg):  4 columns
Tablet (md):   2 columns
Mobile:        1 column
Gap:           24px (gap-6)
```

### Sidebar
```
Width: 256px (w-64)
Background: white
Shadow: medium
Padding: 16px (p-4)
```

### Content Area
```
Padding: 24px (p-6)
Max Width: 100%
Background: #f9fafb
```

---

## Animations

### Transitions
```css
Duration: 200ms
Timing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Hover Effects
```css
Cards: scale(1.02) + shadow increase
Buttons: brightness increase
Links: color change
```

### Page Transitions (Framer Motion)
```javascript
Fade In: 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}

Slide Up:
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}

Scale:
  whileHover={{ scale: 1.02 }}
```

---

## Icons

### Icon Library
**Lucide React** - Consistent, minimal, professional

### Common Icons
```
Dashboard:    LayoutDashboard
Tasks:        CheckSquare
Users:        Users
Notifications: Bell
Logout:       LogOut
Create:       Plus
Search:       Search
Filter:       Filter
Calendar:     Calendar
User:         User
Clock:        Clock
Alert:        AlertCircle
```

### Icon Sizes
```
Small:   w-4 h-4 (16px)
Medium:  w-5 h-5 (20px)
Large:   w-6 h-6 (24px)
XL:      w-8 h-8 (32px)
```

---

## Spacing System

### Base Unit: 4px

```
Tiny:    4px  (spacing-1)
Small:   8px  (spacing-2)
Medium:  16px (spacing-4)
Large:   24px (spacing-6)
XL:      32px (spacing-8)
2XL:     48px (spacing-12)
```

### Component Spacing
```
Card Padding:      24px (p-6)
Section Margin:    32px (mb-8)
Element Gap:       16px (gap-4)
Form Field Gap:    20px (space-y-5)
Grid Gap:          24px (gap-6)
```

---

## Shadows

### Soft Shadow
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```
**Use for:** Default cards, dropdowns

### Medium Shadow
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```
**Use for:** Hover states, active cards

### Large Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
```
**Use for:** Modals, important elements

---

## Border Radius

```
Small:  4px  (rounded)
Medium: 8px  (rounded-lg)
Large:  12px (rounded-xl)
XL:     16px (rounded-2xl)
Full:   9999px (rounded-full)
```

### Usage
```
Buttons:        rounded-lg
Cards:          rounded-xl
Modals:         rounded-2xl
Badges:         rounded-full
Avatar:         rounded-full
Input Fields:   rounded-lg
```

---

## Forms

### Input Fields
```
Height: 42px (py-2.5)
Padding: 16px (px-4)
Border: 1px solid #d1d5db
Border Radius: 8px
Focus: 2px ring, black color
Font Size: 16px
```

### Select Dropdowns
```
Same as input fields
Dropdown icon: right side
Options: white background
Option hover: gray-50
```

### Textarea
```
Min Height: 100px
Padding: 16px
Border: 1px solid #d1d5db
Resize: vertical
```

---

## Notifications

### Toast Notifications
```
Position: top-right
Duration: 4000ms
Background: white
Padding: 12px 20px
Border Radius: 12px
Shadow: 0 4px 16px rgba(0,0,0,0.12)
```

### Icons by Type
```
Success: ✅ Green
Error:   ❌ Red
Info:    ℹ️ Blue
Warning: ⚠️ Yellow
```

---

## Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

### Sidebar Behavior
```
Mobile:   Collapsible overlay
Tablet:   Collapsible overlay
Desktop:  Always visible
```

### Grid Columns
```
Mobile:   1 column
Tablet:   2 columns
Desktop:  3-4 columns
```

---

## Loading States

### Spinner
```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

### Skeleton Loaders
```
Background: linear-gradient shimmer effect
Height: matches content
Border Radius: matches element
```

---

## Empty States

### Design
```
Icon: Large, gray (64x64)
Title: Medium, gray-500
Description: Small, gray-400
Action Button: Primary or secondary
```

### Common Icons
```
No Tasks:         CheckSquare
No Employees:     Users
No Notifications: Bell
No Results:       Search
```

---

## Accessibility

### Focus States
```
Ring: 2px solid
Color: black (#000000)
Offset: 2px
Border Radius: matches element
```

### Color Contrast
```
Text on White:    #111827 (AAA)
White on Black:   #FFFFFF (AAA)
Badge Text:       700 shade (AA+)
```

### Interactive Elements
```
Min Touch Target: 44x44px
Clear Focus Indicators
Keyboard Navigation Support
ARIA Labels Ready
```

---

## Mobile Optimization

### Touch Targets
```
Minimum: 44x44px
Buttons: 48px height
Cards: Full width padding
Spacing: Increased for thumbs
```

### Navigation
```
Hamburger menu
Overlay sidebar
Bottom spacing for iOS
Safe area consideration
```

---

## Print Styles (Future)

```css
@media print {
  /* Hide navigation, sidebar */
  /* Show only main content */
  /* Black & white friendly */
  /* Page breaks */
}
```

---

## Best Practices

### DO ✅
- Use consistent spacing (multiples of 4)
- Maintain color hierarchy
- Use proper contrast ratios
- Add hover states to interactive elements
- Provide loading and empty states
- Use semantic HTML
- Test on mobile devices

### DON'T ❌
- Mix different rounded corner sizes
- Use too many colors
- Forget focus states
- Overcomplicate animations
- Ignore mobile experience
- Skip loading states
- Use inconsistent spacing

---

## Component Examples

### Task Card
```
Border Left: 4px (priority color)
Background: white
Padding: 24px
Shadow: soft
Hover: medium shadow + scale(1.02)
Border Radius: 12px
```

### Stat Card
```
Icon: Colored background circle
Number: Large, bold (text-3xl)
Label: Small, medium gray
Trend: Green/Red with icon
```

### Modal
```
Overlay: black 50% opacity
Container: white, rounded-2xl
Max Width: 640px (2xl)
Shadow: large
Animation: fade + scale
```

---

## Design Tokens (Tailwind Config)

```javascript
colors: {
  primary: '#000000',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
}

fontFamily: {
  sans: ['Inter', 'system-ui']
}

boxShadow: {
  soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
  large: '0 8px 32px rgba(0, 0, 0, 0.16)'
}
```

---

## Implementation Reference

All styles are implemented in:
- `frontend/tailwind.config.js` - Theme configuration
- `frontend/src/index.css` - Global styles & utilities
- Component files - Component-specific styles

---

**Design Philosophy: Simple > Complex | Clean > Cluttered | Minimal > Excessive**
