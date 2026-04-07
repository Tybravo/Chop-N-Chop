# Chopnchop Style Guide

This document describes the global styling system used across the Chopnchop frontend application, including how light/dark mode works, where it’s implemented, and which theme tokens to use. 

Our core brand colors are **Orange** (Primary), **Black** (Secondary/Background), and **Blue** (Accent).

## Light/Dark Mode (Global)

### Source of truth
- Theme is applied on the root `<html>` element using:
  - `class="dark"` (Tailwind `dark:` variant)
  - `data-theme="dark" | "light"` (auxiliary indicator)
- Theme persistence key:
  - `localStorage["chopnchop-theme"]` = `"dark"` or `"light"`

### Files & directories

**Initialization (default theme + no flash on load)**
- `app/layout.tsx`
  - Sets default theme on `<html>` for first paint.
  - Runs an inline script in `<head>` that syncs `<html>` attributes with `localStorage`.

**Global theme state and toggle logic**
- `app/context/ThemeContext.tsx`
  - React context that exposes `{ theme, toggleTheme }`.
  - Reads/writes `localStorage["chopnchop-theme"]`.
  - Toggles the `.dark` class and `data-theme` attribute on `<html>`.

**Theme toggle UI**
- `components/ThemeToggle.tsx`
  - Calls `toggleTheme()` and displays the sun/moon icon.

**Global CSS + Tailwind v4 dark variant**
- `app/globals.css`
  - Tailwind v4 entrypoint: `@import "tailwindcss";`
  - Defines the project’s dark-mode selector:
    - `@custom-variant dark (&:where(.dark, .dark *));`
  - Defines global theme tokens in `@theme inline`.
  - Defines `:root` (light) and `.dark` (dark) CSS variable overrides.

> **NOTE:** Don’t remove the `@custom-variant dark (...)` line from `app/globals.css`. If it’s removed, Tailwind’s `dark:` styles will stop working.

## Usage (Contributor Rules)

### 1) Styling components for both themes
Use Tailwind’s `dark:` variant for anything that must switch between light and dark:

```tsx
<div className="bg-white text-black dark:bg-black dark:text-white border-orange-500">
  ...
</div>
```

### 2) Access theme in a client component

```tsx
"use client";

import { useTheme } from "@/app/context/ThemeContext";

export function ExampleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="bg-orange-600 text-white">
      Current theme: {theme}
    </button>
  );
}
```

## Global Theme Tokens (Chopnchop)

These tokens are globally available via Tailwind v4’s `@theme inline` in `app/globals.css`.

### Colors
- `primary`: `#ea580c` (Orange)
- `primary-foreground`: `#ffffff`
- `primary-light`: `#f97316`
- `primary-dark`: `#c2410c`
- `secondary`: `#000000` (Black)
- `secondary-foreground`: `#ffffff`
- `secondary-light`: `#262626`
- `accent`: `#2563eb` (Blue)
- `accent-foreground`: `#ffffff`
- `accent-light`: `#3b82f6`
- `accent-dark`: `#1d4ed8`

### Shadows
- `shadow-glow-orange`
- `shadow-glow-blue`
- `shadow-header`

## Default Theme Behavior
- Default is **light mode** for new users (standard for food delivery interfaces to keep a fresh look).
- If `localStorage["chopnchop-theme"] === "dark"`, the app loads in dark mode.
