import type { Experimental_GoogleRealtimeModelOptions } from "@ai-sdk/google";
import type { Experimental_RealtimeSessionConfig } from "ai";

export const VOICE_MODEL = "gemini-3.8-live";

export const CALL_STARTED = "[call connected]";

export const voiceSessionConfig = {
  voice: "Puck",
  outputModalities: ["audio"],
  inputAudioFormat: { type: "audio/pcm", rate: 16000 },
  inputAudioTranscription: {},
  outputAudioTranscription: {},
  providerOptions: {
    google: {
      defaultToolBehavior: "BLOCKING",
    } satisfies Experimental_GoogleRealtimeModelOptions,
    inputAudioTranscription: {
      languageCodes: ["en-GB"],
    },
  },
} satisfies Experimental_RealtimeSessionConfig;
