import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createIdGenerator,
} from "ai";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import { webSearch } from "@/lib/exa/search-tool";
import { z } from "zod";

const MODEL_WHITELIST = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro",
] as const;
const DEFAULT_MODEL = MODEL_WHITELIST[0];

const requestSchema = z
  .object({
    message: z.unknown().optional(),
    messages: z.array(z.unknown()).optional(),
    chatId: z.string().optional(),
    model: z.string().optional(),
    webSearch: z.boolean().optional(),
  })
  .refine(
    (data) => data.message || (data.messages && data.messages.length > 0),
    {
      message: "Debes proporcionar al menos un mensaje",
    },
  );

const isAllowedModel = (
  candidate: string,
): candidate is (typeof MODEL_WHITELIST)[number] =>
  MODEL_WHITELIST.includes(candidate as (typeof MODEL_WHITELIST)[number]);

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

  const body = await req.json().catch(() => null);

  if (!body) {
    return new Response(
      JSON.stringify({
        error: "Solicitud inválida",
        message: "El cuerpo de la solicitud debe ser JSON válido.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const parsedBody = requestSchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response(
      JSON.stringify({
        error: "Solicitud inválida",
        message: "Los datos enviados no cumplen con el formato esperado.",
        detalles: parsedBody.error.flatten(),
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const {
    message,
    messages,
    chatId,
    model,
    webSearch: webSearchRequested,
  } = parsedBody.data;

  // Build the messages array
  let uiMessages: UIMessage[];

  if (message && chatId) {
    // Load previous messages from persistence (we'll implement this on client side using SQLite)
    // For now, just use the single message
    uiMessages = [message as UIMessage];
  } else if (messages) {
    uiMessages = messages as UIMessage[];
  } else {
    uiMessages = message ? [message as UIMessage] : [];
  }

  const resolvedModel: (typeof MODEL_WHITELIST)[number] =
    model && isAllowedModel(model) ? model : DEFAULT_MODEL;
  const shouldUseWebSearch = webSearchRequested ?? true;
  const displayName =
    typeof user.user_metadata.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name
      : "usuario verificado";

  const systemPrompt = `You are an assistant specialized in fact-checking. Your mission is to help users verify what they are asking you.

Verification process:
1. Carefully analyze the user's question.
2. Identify the key elements that require verification.
3. ${shouldUseWebSearch ? "Use the web search tool to locate reliable and current sources." : "Do not use external search tools for this response; rely solely on your trained knowledge and make it clear that no external sources were consulted."}
4. Compare the information found and evaluate its reliability.
5. Issue a clear conclusion about the veracity of the fact.

When responding, consider the following:
- Explanation: describe the findings clearly.

Always maintain a professional, objective, and impartial tone and avoid personal opinions. Mention any contradictions found. Respond exclusively in spanish and avoid innecesary foreign terms.

Current user: ${displayName}.`;

  const result = streamText({
    model: google(resolvedModel),
    messages: convertToModelMessages(uiMessages),
    system: systemPrompt,
    ...(shouldUseWebSearch
      ? {
          tools: {
            webSearch,
          },
          stopWhen: stepCountIs(5),
        }
      : {}),
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
    sendSources: shouldUseWebSearch,
    originalMessages: uiMessages,
    // Generate server-side IDs for persistence
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
  });
}
