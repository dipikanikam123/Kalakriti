# Kalakriti Website Theme Guide

## 🎨 Color Palette

### Primary Colors
- **Purple (Primary)**: 
  - `purple-600` (#9333EA) - Main purple
  - `purple-700` (#7E22CE) - Darker purple
  - `purple-800` (#6B21A8) - Darkest purple
  - `purple-500` (#A855F7) - Lighter purple
  - `purple-100` (#F3E8FF) - Very light purple (text on dark)

### Accent Colors
- **Orange (Accent)**:
  - `orange-500` (#F97316) - Main orange
  - `orange-600` (#EA580C) - Darker orange
  - `orange-400` (#FB923C) - Lighter orange

### Supporting Colors
- **Green** (for success/admin): `green-500`, `green-600`
- **Red** (for cart badge/alerts): `red-600`
- **Gray** (for text): `gray-600`, `gray-700`, `gray-800`, `gray-900`

---

## 📐 Component Theme Guidelines

### Navbar
- Background: `backdrop-blur-md` with shadow
- Logo "Kala": `text-orange-500`
- Logo "kriti": `text-black`
- Links: `text-black` with `hover:text-orange-500`
- Buttons: `bg-purple-600 hover:bg-purple-700`
- Admin Button: `bg-green-600 hover:bg-green-700`

### Footer
- Background: `bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800`
- Logo "Kala": `text-orange-400`
- Logo "kriti": `text-white`
- Section Headings: `text-orange-400`
- Links: `text-purple-100` with `hover:text-orange-400`
- Icons: `text-orange-400`
- Social Icons: Hover to `orange-500/orange-600` gradient

### Buttons
- **Primary**: `bg-purple-600 hover:bg-purple-700 text-white`
- **Secondary**: `bg-orange-500 hover:bg-orange-600 text-white`
- **Success**: `bg-green-600 hover:bg-green-700 text-white`
- **Outlined**: `border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white`

### Cards
- Background: `bg-white`
- Border: `border border-gray-100` or `border-purple-100`
- Hover: `hover:shadow-xl hover:border-purple-300`
- Accent elements: `bg-gradient-to-br from-purple-50 to-orange-50`

### Forms
- Input Border: `border-gray-200 focus:border-purple-500`
- Input Ring: `focus:ring-2 focus:ring-purple-200`
- Labels: `text-gray-700 font-semibold`

### Backgrounds
- **Hero Sections**: `bg-gradient-to-br from-purple-50 via-white to-orange-50`
- **Feature Sections**: `bg-gradient-to-br from-orange-50 to-purple-50`
- **Dark Sections**: `bg-gradient-to-br from-purple-600 to-purple-800`

### Text
- **Headings**: `text-gray-900` or `text-white` (on dark backgrounds)
- **Body**: `text-gray-600` or `text-gray-700`
- **Muted**: `text-gray-500`
- **Accent Text**: `text-purple-600` or `text-orange-500`

### Links
- Default: `text-purple-600 hover:text-orange-500`
- On Dark: `text-purple-100 hover:text-orange-400`

---

## 🎯 Usage Examples

### Hero Section
```jsx
<section className="bg-gradient-to-br from-purple-50 via-white to-orange-50">
  <h1 className="text-gray-900">
    <span className="text-orange-600">Kala</span>kriti
  </h1>
  <p className="text-gray-700">
    <span className="text-purple-500 font-semibold">Tagline</span>
  </p>
  <button className="bg-purple-600 hover:bg-purple-700 text-white">
    Get Started
  </button>
</section>
```

### Card Component
```jsx
<div className="bg-white border border-gray-100 hover:border-purple-300 hover:shadow-xl rounded-3xl">
  <h3 className="text-gray-900">Title</h3>
  <p className="text-gray-600">Description</p>
  <button className="bg-orange-500 hover:bg-orange-600 text-white">
    Learn More
  </button>
</div>
```

### Form Input
```jsx
<input 
  className="border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl"
/>
```

---

## ✨ Special Effects

### Gradients
- **Purple to Orange**: `bg-gradient-to-r from-purple-600 to-orange-500`
- **Light Background**: `bg-gradient-to-br from-purple-50 via-white to-orange-50`
- **Dark Background**: `bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800`

### Shadows
- **Card**: `shadow-xl shadow-gray-200/50`
- **Button**: `shadow-lg hover:shadow-xl`
- **Elevated**: `shadow-2xl`

### Hover Effects
- **Scale**: `hover:scale-105 transition-transform duration-300`
- **Translate**: `hover:-translate-y-1 transition-all duration-300`
- **Glow**: `hover:shadow-lg hover:shadow-purple-500/50`

---

## 🚫 Don't Use
- Avoid pure black (`#000000`) - use `gray-900` instead
- Avoid pure white text on colored backgrounds - use `purple-100` or similar
- Avoid mixing too many accent colors - stick to purple and orange
- Avoid flat colors - prefer gradients for backgrounds

---

## ✅ Do Use
- Consistent purple and orange throughout
- Gradients for visual interest
- Smooth transitions and animations
- Proper contrast for accessibility
- Orange for "Kala" in all logos
- Purple for primary actions
- Orange for secondary/accent actions

---

**Last Updated**: February 11, 2026
**Theme Version**: 2.0 (Purple & Orange)
