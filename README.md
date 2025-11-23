# Portfolio Web V4 - Next.js + React + Framer Motion

Migración del portfolio de Arturo Martínez de HTML/CSS/JS vanilla a Next.js con React y Framer Motion.

## 🚀 Características

- **Next.js 14** - Framework React con App Router
- **Framer Motion** - Animaciones fluidas y modernas
- **TypeScript** - Tipado estático para mayor robustez
- **CSS Modules** - Estilos modulares y encapsulados
- **i18n** - Soporte para español e inglés
- **Responsive Design** - Optimizado para móviles y tablets

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build para Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── TopNav.tsx          # Navegación superior
│   ├── OrganicBackground.tsx  # Fondo animado (Canvas)
│   ├── Slider.tsx          # Contenedor de slides
│   ├── Scene3D.tsx         # Escena 3D principal
│   ├── Hotspot.tsx         # Puntos interactivos
│   ├── TypingText.tsx      # Efecto de typing
│   └── Modal.tsx           # Panel lateral de información
├── contexts/
│   └── LanguageContext.tsx # Contexto de idioma
└── public/
    ├── Arturo_NB.png       # Imagen principal
    └── Who_Arturo.jpeg     # Imagen secundaria
```

## 🚢 Despliegue en Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Vercel detectará automáticamente Next.js
3. El despliegue se realizará automáticamente en cada push

O manualmente:

```bash
npm install -g vercel
vercel
```

## ✨ Características Implementadas

- ✅ Fondo orgánico animado con Canvas
- ✅ Efecto 3D tilt en la foto principal
- ✅ Hotspots interactivos con física
- ✅ Sistema de modales con animaciones
- ✅ Efecto de typing en texto
- ✅ Cambio de idioma (ES/EN)
- ✅ Diseño responsive
- ✅ Animaciones con Framer Motion

## 🎨 Mantenimiento del Diseño Original

El diseño visual se mantiene idéntico al original, pero ahora con:
- Mejor rendimiento gracias a React
- Animaciones más fluidas con Framer Motion
- Código más mantenible y escalable
- Optimización automática de imágenes con Next.js

