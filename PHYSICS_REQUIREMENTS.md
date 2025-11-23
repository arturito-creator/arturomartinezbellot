# Sistema de Física de Partículas para Hotspots

## Contexto
Aplicación Next.js 14 con React 18 y TypeScript. Los hotspots son componentes `Hotspot` renderizados dentro de un componente `Scene3D` que contiene una imagen principal con efecto de tilt 3D.

## Requisitos del Sistema de Física

### Objetivo
Implementar un sistema de simulación física para los puntos verdes (hotspots) que simule el comportamiento de partículas cargadas eléctricamente.

### Comportamiento Físico Requerido

1. **Repulsión entre Partículas (Cargas Positivas)**
   - Cada punto verde se comporta como una partícula con carga positiva
   - Las partículas se repelen entre sí siguiendo la Ley de Coulomb: `F = k * q1 * q2 / r²`
   - La fuerza de repulsión debe ser inversamente proporcional al cuadrado de la distancia
   - Implementar una constante de repulsión ajustable (`repulsionStrength`)

2. **Atracción Débil al Centro (Carga Negativa Invisible)**
   - En el centro de la escena (no visible) existe una "carga negativa" muy débil
   - Esta carga atrae suavemente a todas las partículas hacia el centro
   - La fuerza de atracción debe ser proporcional a la distancia al centro (como un resorte)
   - La constante de atracción debe ser mucho menor que la de repulsión para mantener el equilibrio

3. **Fricción/Damping**
   - Aplicar fricción a las velocidades para evitar movimiento perpetuo
   - Factor de damping ajustable (ej: 0.95 = conserva 95% de velocidad por frame)

4. **Límites de Velocidad**
   - Implementar velocidad máxima para evitar movimientos bruscos
   - Limitar la velocidad cuando exceda el máximo

5. **Colisiones con Bordes**
   - Las partículas deben rebotar suavemente cuando alcancen los límites de la escena
   - Mantener un margen desde los bordes

### Requisitos Técnicos

#### Estructura
- Crear un hook personalizado `useHotspotPhysics` en `hooks/useHotspotPhysics.ts`
- El hook debe recibir:
  - `sceneRef`: React.RefObject<HTMLElement> - Referencia al contenedor principal
  - `hotspotElements`: HTMLElement[] - Array de elementos DOM de los hotspots

#### Funcionalidad
- El hook debe:
  1. Inicializar las partículas en posiciones aleatorias alrededor del centro
  2. Calcular fuerzas en cada frame de animación (usar `requestAnimationFrame`)
  3. Actualizar velocidades basadas en las fuerzas calculadas
  4. Actualizar posiciones basadas en las velocidades
  5. Aplicar las posiciones directamente al DOM usando `style.left` y `style.top`
  6. Usar posicionamiento `fixed` para que no se vean afectados por transformaciones del padre

#### Consideraciones Importantes
- **No debe reaccionar al movimiento del mouse**: El sistema de tilt 3D no debe afectar las posiciones de las partículas
- **Usar un rect fijo**: Guardar el `getBoundingClientRect()` inicial y no recalcularlo constantemente
- **Sincronización**: Asegurar que los elementos estén disponibles en el DOM antes de inicializar
- **Performance**: Optimizar cálculos para 60fps sin lag

#### Valores de Configuración Sugeridos
```typescript
{
  repulsionStrength: number,    // Fuerza de repulsión (ej: 50000)
  centerAttraction: number,      // Fuerza de atracción al centro (ej: 0.05)
  damping: number,               // Factor de fricción (ej: 0.95)
  maxSpeed: number,              // Velocidad máxima (ej: 5)
  minDistance: number            // Distancia mínima para evitar explosiones (ej: 20)
}
```

### Integración
- El hook debe ser llamado desde `Scene3D.tsx`
- Los hotspots ya están renderizados con `position: fixed`
- No modificar el componente `Hotspot` existente, solo su posición mediante estilos inline

### Resultado Esperado
Las partículas deben moverse de forma fluida y natural, repeliéndose entre sí pero manteniéndose cerca del centro debido a la atracción débil. El movimiento debe ser suave y continuo, sin saltos bruscos ni comportamientos erráticos.

