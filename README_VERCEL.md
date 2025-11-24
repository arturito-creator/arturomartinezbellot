# Configuración para Vercel

Esta guía explica cómo configurar el proyecto para el despliegue en Vercel, especialmente la integración con OpenAI.

## 🚀 Variables de Entorno en Vercel

### Configuración en el Dashboard de Vercel

1. Ve a tu proyecto en el [Dashboard de Vercel](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Añade la siguiente variable:

```
OPENAI_API_KEY=sk-tu-api-key-aqui
```

**Importante:**
- ✅ La variable debe estar disponible para **Production**, **Preview** y **Development**
- ✅ No incluyas espacios antes o después del `=`
- ✅ La API key debe comenzar con `sk-`

### Obtener tu API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Crea una nueva API key
4. Copia la key y pégala en Vercel

## ⚙️ Configuración del Proyecto

El proyecto ya está configurado para funcionar en Vercel:

- ✅ **Streaming**: Compatible con Vercel Serverless Functions
- ✅ **Runtime**: Node.js (configurado en el route handler)
- ✅ **Timeouts**: Configurado para 30 segundos (requiere plan Pro para respuestas largas)
- ✅ **Headers**: Optimizados para streaming en Vercel

## 📝 Notas Importantes

### Límites de Tiempo en Vercel

- **Plan Hobby**: 10 segundos máximo por función
- **Plan Pro**: 60 segundos máximo por función
- **Plan Enterprise**: Hasta 300 segundos

El código está configurado con `maxDuration = 30` segundos, lo que requiere al menos el plan Pro. Si estás en el plan Hobby, cambia a `maxDuration = 10` en `app/api/chat/route.ts`.

### Streaming

El streaming funciona correctamente en Vercel. Los chunks se envían en tiempo real sin problemas.

### Monitoreo

Puedes monitorear las llamadas a la API en:
- **Vercel Dashboard** → **Functions** → Ver logs y métricas
- **OpenAI Dashboard** → Ver uso y costos

## 🔒 Seguridad

- ✅ La API key **nunca** se expone al cliente
- ✅ Solo se usa en código de servidor (route handlers)
- ✅ Los errores no exponen información sensible

## 🧪 Probar Localmente

Para probar localmente antes de desplegar:

1. Crea un archivo `.env.local` en la raíz del proyecto:
```env
OPENAI_API_KEY=sk-tu-api-key-aqui
```

2. Ejecuta:
```bash
npm run dev
```

3. Prueba el chat en `http://localhost:3000`

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no está configurada"

- Verifica que la variable esté configurada en Vercel
- Asegúrate de que esté disponible para el entorno correcto (Production/Preview)
- Redespliega el proyecto después de añadir la variable

### Error: "Function timeout"

- Verifica tu plan de Vercel
- Ajusta `maxDuration` según tu plan
- Considera usar un modelo más rápido (ya estás usando `gpt-4o-mini`)

### Streaming no funciona

- Verifica que los headers estén correctos
- Revisa los logs en Vercel Dashboard
- Asegúrate de que el cliente esté leyendo el stream correctamente

