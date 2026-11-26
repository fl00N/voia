import { experimental_getRealtimeToolDefinitions } from "ai";

import { google } from "@/lib/ai/google";
import { buildInstructions } from "@/lib/ai/instructions";
import { tools } from "@/lib/ai/tools";
import { VOICE_MODEL, voiceSessionConfig } from "@/lib/ai/voice";
import { listBarbers, listServices } from "@/lib/booking/store";

export async function POST() {
  try {
    const toolDefinitions = await experimental_getRealtimeToolDefinitions({
      tools,
    });

    const vocabulary = [
      "Voia",
      ...listServices().map((service) => service.name),
      ...listBarbers().map((barber) => barber.name),
    ];

    const token = await google.experimental_realtime.getToken({
      model: VOICE_MODEL,
      sessionConfig: {
        ...voiceSessionConfig,
        instructions: buildInstructions("voice"),
        tools: toolDefinitions,
        providerOptions: {
          ...voiceSessionConfig.providerOptions,
          inputAudioTranscription: {
            ...voiceSessionConfig.providerOptions.inputAudioTranscription,
            customVocabulary: vocabulary,
          },
        },
      },
    });

    return Response.json({ ...token, tools: toolDefinitions });
  } catch (error) {
    console.error("Realtime setup error:", error);

    return Response.json(
      { error: "Could not start the call" },
      { status: 500 },
    );
  }
}
