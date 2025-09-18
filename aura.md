# Aura Builder - App & Page Creation Platform

## Overview

Aura Builder is a no-code/low-code platform for rapidly creating applications and web pages. Built with React 18 and enhanced Liquid Glass design system, it enables users to build professional applications and websites in minutes without writing code.

## User Preferences

Preferred communication style: Simple, everyday language.
Focus: Creating apps and pages quickly with high quality and craftsmanship.

## System Architecture

### Core Purpose
- **Primary Function**: Rapid application and page creation platform
- **Target Users**: Designers, developers, and non-technical users who need to build apps quickly
- **Key Value**: Speed + Professional Quality + No-code approach

### Frontend Architecture
- **React 18** with modern functional components and hooks
- **Vite** for lightning-fast development and hot module replacement
- **React Router DOM** for seamless single-page application navigation
- **Enhanced Liquid Glass Design System** with advanced visual effects
- **TailwindCSS** with custom liquid animations and glass morphism
- **Lucide React** for consistent and beautiful iconography

### Design System - Liquid Glass
- **Enhanced Glass Morphism**: Advanced backdrop blur effects with layered transparency
- **Liquid Animations**: Flowing, organic animations with gradient shifts
- **Interactive Elements**: Hover effects with shimmer animations and glow effects
- **Gradient System**: Multi-color gradients with automatic animation cycles
- **Responsive Glass**: Adaptive glass effects for different screen sizes

### Application Structure
- **Dashboard**: Main hub with quick starters and recent projects
- **Page Builder**: Drag-and-drop interface for creating pages (planned)
- **Template Library**: Collection of ready-to-use templates for various use cases
- **Code Export**: Generate clean, production-ready code from visual designs (planned)

### Quick Starters Available
1. **Website**: Multi-page professional websites (5 minutes)
2. **Mobile App**: Responsive mobile applications (10 minutes)
3. **Dashboard**: Admin panels with charts and tables (8 minutes)
4. **Landing Page**: Marketing pages for products (3 minutes)

### Styling System
- **Liquid Glass CSS**: Advanced glass effects with liquid animations
- **Color Palette**: Purple (#8b5cf6), Pink (#ec4899), Cyan (#06b6d4)
- **Animation Library**: Floating elements, gradient shifts, shimmer effects
- **RTL Support**: Right-to-left text direction for Arabic interface
- **Custom Scrollbars**: Gradient-styled scrollbars matching the theme

### Development Setup
- **Hot Module Replacement**: Instant updates during development
- **Development server**: Configured on `0.0.0.0:5000` for universal access
- **Modern CSS**: Advanced CSS features with fallbacks for browser compatibility
- **Performance Optimized**: Lazy loading and efficient re-rendering

## External Dependencies

### Core Framework
- **React/React DOM**: Modern component-based architecture
- **React Router DOM**: Client-side routing and navigation

### Styling and Design
- **TailwindCSS**: Utility-first CSS framework for rapid development
- **Lucide React**: High-quality icon library with consistent design

### Development Tools
- **Vite**: Next-generation build tool with fast HMR
- **PostCSS**: CSS processing for modern features

## Features Status

### ✅ Completed
- Enhanced Liquid Glass design system
- Responsive dashboard with quick starters
- Template library foundation
- Modern React architecture
- RTL Arabic interface support

### 🔄 In Progress
- App builder core functionality

### 📋 Planned
- Drag-and-drop page builder
- Advanced template system
- Code generation and export
- Live preview functionality
- Component library
- Template marketplace

## Recent Changes

**September 17, 2025:**
- **MAJOR SYSTEM OVERHAUL COMPLETED**: Successfully implemented comprehensive technical infrastructure updates
- **Port 5000 Configuration**: Updated vite.config.js with proper allowedHosts and HMR settings for universal access
- **Fixed Header Layout**: Implemented stable fixed header with proper scroll container (#main-scroll-container) and CSS height management
- **Router Architecture**: Converted from problematic Outlet pattern to reliable children-based routing in Layout component
- **Local Testing Capability**: Created entities compatibility layer (scripts/gen-local-entities.mjs) enabling development without backend dependencies
- **API Standardization**: Updated 25+ API calls across 19 files to consistent orderBy format for proper data sorting
- **Import System**: Unified all entity imports to use '@/compat/entities' pattern, eliminating import errors
- **Workflow Stability**: Established reliable development server workflow with hot module replacement on port 5000