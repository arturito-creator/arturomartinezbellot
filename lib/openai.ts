import OpenAI from 'openai'

/**
 * Cliente de OpenAI configurado para uso en servidor.
 * La API key se obtiene de variables de entorno.
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY no está configurada. Por favor, configura la variable de entorno OPENAI_API_KEY.'
    )
  }

  return new OpenAI({
    apiKey,
  })
}

