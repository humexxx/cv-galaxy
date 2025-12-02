# Configuración de OpenAI para CV Galaxy

## Resumen de Cambios

Se ha implementado la integración completa con OpenAI para el chat de CV con las siguientes características:

### 1. **Schema actualizado**
- Ahora se pasa el `userId` en el request para identificar de qué CV se está hablando
- Validación con Zod del userId

### 2. **Servicio de OpenAI**
- Ubicación: `lib/services/openai-service.ts`
- Implementa streaming de respuestas para experiencia tipo ChatGPT
- Maneja conversiones de formato y errores de OpenAI

### 3. **Sistema de Prompts**
- Ubicación: `lib/constants/prompts.ts`
- Prompt profesional que define el rol del asistente AI
- El CV completo se pasa como contexto en formato JSON
- Función helper para formatear el prompt con datos del CV

### 4. **Streaming de datos**
- API Route actualizada para retornar Server-Sent Events (SSE)
- Cliente actualizado para recibir y mostrar chunks en tiempo real
- Auto-scroll mientras se recibe contenido
- Experiencia similar a ChatGPT

## Configuración Requerida

### 1. Variable de Entorno

Necesitas agregar tu API Key de OpenAI en el archivo `.env.local`:

```bash
OPENAI_API_KEY=sk-...your-api-key-here
```

### 2. Obtener API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Inicia sesión o crea una cuenta
3. Ve a API Keys: https://platform.openai.com/api-keys
4. Crea una nueva API key
5. Copia la key y agrégala al archivo `.env.local`

### 3. Modelos Disponibles

El servicio está configurado para usar `gpt-4-turbo-preview` por defecto, pero puedes cambiarlo a:
- `gpt-4-turbo-preview` - Más potente y preciso
- `gpt-4` - Versión estable de GPT-4
- `gpt-3.5-turbo` - Más rápido y económico

Para cambiar el modelo por defecto, edita `lib/services/openai-service.ts`.

## Archivos Modificados

```
schemas/chat.ts                     # Agregado userId al schema
lib/constants/prompts.ts            # NUEVO - Sistema de prompts
lib/services/openai-service.ts      # NUEVO - Servicio de OpenAI
lib/services/chat-service.ts        # Actualizado para streaming
app/api/chat/route.ts               # Implementación de streaming
components/ai-chat.tsx              # Soporte para streaming y userId
components/cv-with-chat-layout.tsx  # Pasa userId al chat
app/[username]/page.tsx             # Pasa username como userId
```

## Cómo Funciona

1. **Usuario hace una pregunta** en el chat
2. **Se obtiene el CV** del usuario usando el `userId`
3. **Se formatea el prompt del sistema** con los datos del CV en JSON
4. **Se envía a OpenAI** junto con el historial de mensajes
5. **OpenAI responde en streaming** chunk por chunk
6. **El cliente muestra** cada chunk en tiempo real
7. **Auto-scroll** mientras llega el contenido

## Prompt del Asistente

El asistente AI está configurado como:
- Especialista en consultoría de carrera y reclutamiento
- Analiza CVs en profundidad
- Responde basándose estrictamente en los datos del CV
- Tono profesional pero amigable
- Proporciona contexto y valor agregado

## Pruebas

Para probar la integración:

1. Asegúrate de tener la API key configurada
2. Inicia el servidor: `npm run dev`
3. Ve a cualquier CV, por ejemplo: http://localhost:3000/humexxx
4. Haz clic en el botón de AI Assistant
5. Prueba preguntas como:
   - "Summarize this CV"
   - "What are the key skills?"
   - "Years of experience?"
   - "Tell me about the work at Intel"

## Costos

Ten en cuenta que cada llamada a la API de OpenAI tiene un costo:
- GPT-4 Turbo: ~$0.01 por 1K tokens de entrada, ~$0.03 por 1K tokens de salida
- GPT-3.5 Turbo: ~$0.0005 por 1K tokens de entrada, ~$0.0015 por 1K tokens de salida

Monitorea tu uso en: https://platform.openai.com/usage

## Solución de Problemas

### Error: "OpenAI API key is not configured"
- Verifica que tengas `OPENAI_API_KEY` en tu `.env.local`
- Reinicia el servidor después de agregar la variable

### Error: "CV not found for the specified user"
- Verifica que el `userId` sea correcto
- Revisa que exista en `data/cvs.ts`

### Streaming no funciona
- Verifica que el navegador soporte Server-Sent Events
- Revisa la consola del navegador para errores
- Asegúrate de que la API key sea válida

## Próximas Mejoras

Posibles mejoras futuras:
- Caché de respuestas para preguntas comunes
- Límite de rate limiting por usuario
- Histórico de conversaciones persistente
- Feedback de usuario sobre respuestas
- Diferentes "personalidades" del asistente
- Soporte multiidioma
