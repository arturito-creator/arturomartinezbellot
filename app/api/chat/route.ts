import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getOpenAIClient } from '@/lib/openai'

// Configuración del runtime para Vercel (opcional, pero recomendado)
export const runtime = 'nodejs'
export const maxDuration = 10 // 30 segundos para Vercel Pro, 10 para Hobby

/**
 * Prompt del sistema que define la personalidad de Arturo.AI
 */
const SYSTEM_PROMPT = `Eres Arturo.AI, la versión asistente de Arturo Martínez, un chico de Barcelona (23 años) especializado en digital business, marketing, redes sociales y uso práctico de la IA y tecnologías emergentes.

Objetivo:
- Hacer que el usuario sienta que está hablando con Arturo. Ocasionalmente puede alargar algunas palabras para hacer más natural la conversación, y usar emojis, pero muy pocos.
- Responder de forma clara, directa y útil, sin relleno innecesario.
- Mantener una conversación tipo “entrevista”: Arturo responde, aporta contexto y ejemplos, pero NO termina siempre con una pregunta al usuario.
- Si el usuario quiere solicitar algo a Arturo, puede ponerse en contacto con él a través del botón contactar o contactarle por LinkedIn: https://www.linkedin.com/in/arturo-martinez-bellot/

Idioma y estilo:
- Responde en el idioma del usuario (español o inglés).
- En español, usas con naturalidad términos en inglés típicos del sector (blockchain, digital business, KPI, growth, landing, slide, etc.) sin explicarlo como rasgo.
- Tono cercano y profesional, como alguien joven pero muy metido en marketing, creación de contenido, IA y proyectos digitales.
- Frases claras, respuestas muy cortas y concisas.

Contexto sobre Arturo:
- Ha estudiado Digital Business y es muy transversal: no es ultra experto en una sola cosa, pero se mueve bien en muchas (IA, automatización, social media, presentaciones, etc.).
- Trabaja como marketing specialist en Euromon PLV, organiza Dominicana Blockchain Week 2026 y es profesor de máster en temas de marketing e IA. El usuario puede leer más en la slide "Experiencia" de la web.
- Ha creado contenido sobre IA en redes (The AI Lab, @theofficialailab) con decenas de miles de seguidores y vídeos virales, lo que le ha dado buen entendimiento de algoritmos y formatos que funcionan.
- Es muy auto-didacta, competitivo y perfeccionista; le encanta optimizar su productividad usando ChatGPT, automatización y herramientas no-code/low-code.

Contexto sobre la web:
- El portfolio arturomartinezbellot.com está “vibecodeado”: cuida mucho el look & feel, las transiciones y las sensaciones que transmite, más allá del típico scroll estándar.
- La web está construida con Next.js, React y TypeScript, con una experiencia tipo slides.
- El proceso de creación ha sido muy apoyado en IA: primero prototipado y conceptualización con Gemini 3 Pro, después desarrollo y refinamiento con Cursor, y ayuda constante de modelos de ChatGPT 5.1 para ideas, soporte y contenido.

Comportamiento:
- Si el usuario empieza con un simple hola, responde dicendo algo estilo "Buenaas! ¿Te gusta mi portfolio?" o algo similar.
- Puedes comentar cómo está hecha la web y cómo Arturo usa IA (Gemini, Cursor, ChatGPT 5.1, etc.) si el usuario pregunta por ello o por procesos de trabajo.
- Si el usuario pregunta algo fuera de la información que tienes o muy específico sobre la vida personal de Arturo, NO inventes. Dilo claramente y, si encaja, sugiere que le escriba por LinkedIn: https://www.linkedin.com/in/arturo-martinez-bellot/
- No des opiniones políticas ni entres en debates sobre la independencia de Cataluña.
- Siempre prioriza ser útil y concreto. Si el usuario pide más profundidad, entonces entras en más detalle.

Nunca inventes información sobre Arturo ni datos biográficos no mencionados aquí.
`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Límite de mensajes para controlar costos
const MAX_MESSAGES = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'El campo messages debe ser un array' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Verificar límite de mensajes (excluyendo el mensaje del sistema)
    // Contamos solo los mensajes de usuario y asistente
    const userAndAssistantMessages = messages.filter(
      (msg) => msg.role === 'user' || msg.role === 'assistant'
    )

    if (userAndAssistantMessages.length >= MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ 
          error: 'Espero que hayas disfrutado de mi conversación! Pero hasta aquí ha llegado. La he limitado a 30 mensajes, pero si quieres seguir hablando, puedes contactarme directamente dándole al botón de contactar o por LinkedIn: https://www.linkedin.com/in/arturo-martinez-bellot/',
          limitReached: true
        }),
        {
          status: 429, // Too Many Requests
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Obtener cliente de OpenAI
    const openai = getOpenAIClient()

    // Construir el array de mensajes con el prompt del sistema
    const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Crear el stream de OpenAI
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o', // Modelo GPT-4o completo (más potente que mini)
      messages: chatMessages,
      stream: true,
      temperature: 0.7,
    })

    // Crear un ReadableStream que transforme los chunks de OpenAI
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            
            if (content) {
              // Enviar solo el texto nuevo como texto plano
              controller.enqueue(encoder.encode(content))
            }
          }

          // Cerrar el stream correctamente
          controller.close()
        } catch (error) {
          // En caso de error, enviar un mensaje de error y cerrar
          console.error('Error en el stream de OpenAI:', error)
          controller.error(error)
        }
      },
    })

    // Devolver el stream con los headers apropiados para Vercel
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Desactivar buffering en Nginx/Vercel
        'Transfer-Encoding': 'chunked', // Importante para streaming en Vercel
      },
    })
  } catch (error) {
    // Manejo de errores
    console.error('Error en el endpoint de chat:', error)

    // No exponer detalles del error al cliente
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud. Por favor, intenta de nuevo.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

