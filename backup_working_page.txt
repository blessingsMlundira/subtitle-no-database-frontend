"use client";

import { useEffect, useRef, useState } from "react";

type SpeechEvent = Event & {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechRecognizer = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type Direction = "en-ny" | "ny-en";

type Caption = {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
};

type TranslationResponse = {
  source: string;
  translation: string;
  source_language: string;
  target_language: string;
};

const API =
  process.env.NEXT_PUBLIC_TRANSLATION_API ??
  "http://localhost:8000";

const LANGUAGE_SETTINGS = {
  "en-ny": {
    sourceCode: "eng_Latn",
    targetCode: "nya_Latn",
    speechCode: "en-US",
    sourceName: "English",
    targetName: "Chichewa",
  },
  "ny-en": {
    sourceCode: "nya_Latn",
    targetCode: "eng_Latn",
    // Browser support for Chichewa recognition varies.
    speechCode: "ny",
    sourceName: "Chichewa",
    targetName: "English",
  },
} as const;

export default function Home() {
  const [direction, setDirection] = useState<Direction>("en-ny");
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [error, setError] = useState("");

  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const activeRef = useRef(false);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const nextId = useRef(0);

  const language = LANGUAGE_SETTINGS[direction];

  async function translatePhrase(text: string) {
    try {
      const response = await fetch(`${API}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          source_lang: language.sourceCode,
          target_lang: language.targetCode,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Translation service returned ${response.status}`
        );
      }

      const data: TranslationResponse = await response.json();

      setCaptions((previous) => [
        ...previous,
        {
          id: nextId.current++,
          sourceText: text,
          translatedText: data.translation,
          sourceLanguage: language.sourceName,
          targetLanguage: language.targetName,
        },
      ]);
    } catch {
      setError(
        "Translation failed. Check that the backend is running and the translation endpoint supports both language directions."
      );
    }
  }

  function startListening() {
    const browser = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognizer;
      webkitSpeechRecognition?: new () => SpeechRecognizer;
    };

    const SpeechRecognitionAPI =
      browser.SpeechRecognition ??
      browser.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSupported(false);
      setError(
        "Speech recognition is unavailable in this browser. Try a browser that supports the Web Speech API."
      );
      return;
    }

    const recognizer = new SpeechRecognitionAPI();

    recognizer.lang = language.speechCode;
    recognizer.continuous = true;
    recognizer.interimResults = true;

    recognizer.onresult = (event) => {
      let currentInterim = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];
        const text = result[0].transcript.trim();

        if (!text) continue;

        if (result.isFinal) {
          // Keep requests in order so captions remain ordered.
          const requestDirection = direction;

          queueRef.current = queueRef.current
            .then(async () => {
              // Use the direction selected when this phrase was captured.
              await translatePhraseForDirection(
                text,
                requestDirection
              );
            })
            .catch(() => {
              setError("A translation request could not be completed.");
            });
        } else {
          currentInterim += `${text} `;
        }
      }

      setInterim(currentInterim.trim());
    };

    recognizer.onerror = (event) => {
      const speechEvent = event as Event & { error?: string };

      if (speechEvent.error === "not-allowed") {
        setError(
          "Microphone access was denied. Allow microphone access in your browser settings."
        );
      } else if (speechEvent.error === "language-not-supported") {
        setError(
          `This browser does not support speech recognition for ${language.sourceName}. Try a different browser or use a backend speech-recognition service.`
        );
      } else {
        setError(
          `Speech recognition encountered an error${speechEvent.error ? ` (${speechEvent.error})` : ""}.`
        );
      }
    };

    recognizer.onend = () => {
      if (activeRef.current) {
        // Some browsers stop recognition after silence.
        try {
          recognizer.start();
        } catch {
          // It may already be starting.
        }
      } else {
        setListening(false);
      }
    };

    recognizerRef.current = recognizer;
    activeRef.current = true;
    setListening(true);
    setError("");
    setInterim("");

    try {
      recognizer.start();
    } catch {
      activeRef.current = false;
      setListening(false);
      setError("Could not start the microphone. Please try again.");
    }
  }

  async function translatePhraseForDirection(
    text: string,
    selectedDirection: Direction
  ) {
    const settings = LANGUAGE_SETTINGS[selectedDirection];

    try {
      const response = await fetch(`${API}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          source_lang: settings.sourceCode,
          target_lang: settings.targetCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: TranslationResponse = await response.json();

      setCaptions((previous) => [
        ...previous,
        {
          id: nextId.current++,
          sourceText: text,
          translatedText: data.translation,
          sourceLanguage: settings.sourceName,
          targetLanguage: settings.targetName,
        },
      ]);
    } catch {
      setError(
        "Translation failed. Check that the backend is running and supports the selected language direction."
      );
    }
  }

  function stopListening() {
    activeRef.current = false;
    recognizerRef.current?.stop();
    setListening(false);
    setInterim("");
  }

  function changeDirection(value: Direction) {
    if (listening) return;

    setDirection(value);
    setError("");
    setInterim("");
  }

  function clearCaptions() {
    setCaptions([]);
    setError("");
    nextId.current = 0;
  }

  useEffect(() => {
    return () => {
      activeRef.current = false;
      recognizerRef.current?.abort();
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          Live language translation
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Lankhula
        </h1>

        <p className="mt-3 text-gray-600">
          Speak in one language and read the translation in the other.
        </p>
      </header>

      <section className="rounded-2xl border p-5 shadow-sm">
        <label
          htmlFor="direction"
          className="mb-2 block font-medium"
        >
          Translation direction
        </label>

        <select
          id="direction"
          value={direction}
          disabled={listening}
          onChange={(event) =>
            changeDirection(event.target.value as Direction)
          }
          className="w-full rounded-xl border bg-white px-4 py-3 text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="en-ny">
            English → Chichewa
          </option>
          <option value="ny-en">
            Chichewa → English
          </option>
        </select>

        <p className="mt-2 text-sm text-gray-500">
          {listening
            ? `Listening for ${language.sourceName}. Stop listening before changing direction.`
            : `Speak in ${language.sourceName}; captions will appear in ${language.targetName}.`}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">
            {listening
              ? `Listening to ${language.sourceName}…`
              : "Ready to listen"}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm ${
              listening
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {listening ? "Microphone active" : "Stopped"}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {!listening ? (
            <button
              onClick={startListening}
              className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Start listening
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Stop listening
            </button>
          )}

          <button
            onClick={clearCaptions}
            className="rounded-xl border px-4 py-3"
          >
            Clear captions
          </button>
        </div>

        {interim && (
          <p className="mt-5 italic text-gray-500">
            Hearing: {interim}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {!supported && (
          <p className="mt-2 text-sm text-gray-600">
            Use a browser that supports the Web Speech API.
          </p>
        )}
      </section>

      <section className="mt-8 space-y-4" aria-live="polite">
        <h2 className="text-xl font-semibold">
          {language.targetName} captions
        </h2>

        {captions.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            Your translated captions will appear here.
          </div>
        ) : (
          captions.map((caption) => (
            <article
              key={caption.id}
              className="rounded-2xl border p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {caption.sourceLanguage}
              </p>

              <p className="mt-1 text-base text-gray-600">
                {caption.sourceText}
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {caption.targetLanguage}
              </p>

              <p className="mt-1 text-2xl font-medium leading-relaxed">
                {caption.translatedText}
              </p>
            </article>
          ))
        )}
      </section>

      <footer className="mt-10 text-sm text-gray-500">
        Translation is automated. Browser speech recognition may not
        support Chichewa reliably. For important conversations, have
        translations reviewed by a fluent Chichewa speaker.
      </footer>
    </main>
  );
}