import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { webSearch } from "@/lib/exa/search-tool";

export async function POST(req: Request) {
  // Extraer el token de autorización del header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        error: "No autorizado",
        message: "Se requiere autenticación para usar el chat",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const token = authHeader.replace("Bearer ", "");

  // Crear cliente de Supabase del lado del servidor
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({
        error: "Error de configuración",
        message: "Configuración del servidor no disponible",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Verificar la sesión del usuario
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(
      JSON.stringify({
        error: "Sesión inválida",
        message:
          "Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Usuario autenticado, procesar la solicitud del chat
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: convertToModelMessages(messages),
    system: `You are a specialized fact-checking agent. Your main job is to determine if the claims provided by the user are true or false.

VERIFICATION PROCESS:
1. Carefully analyze the user's claim
2. Identify key elements that need to be verified
3. Use the web search tool to find reliable sources
4. Cross-reference information from multiple sources
5. Provide a clear response about the veracity of the fact

EVALUATION CRITERIA:
- TRUE: The claim is supported by multiple reliable sources
- FALSE: The claim is contradicted by solid evidence
- PARTIALLY TRUE: Some aspects are correct, others are not
- INSUFFICIENT INFORMATION: There is not enough evidence to determine veracity

RESPONSE FORMAT:
- Status: [TRUE/FALSE/PARTIALLY TRUE/INSUFFICIENT INFORMATION]
- Explanation: Detailed description of findings
- Sources: Links or references used for verification
- Additional context: Relevant information the user should know

Always be objective, impartial and base your conclusions only on verifiable evidence. If you find contradictory information, mention the different perspectives.

Important: Responde always in Spanish with some level of formatily, even the status values must be in spanish.

Current user: ${user.user_metadata.full_name}`,
    tools: {
      webSearch,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}
