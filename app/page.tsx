"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { SidebarNav } from "./components/SidebarNav";

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

type Language = {
  code: string;
  name: string;
  speechCode: string;
};

type Caption = {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceSpeechCode: string;
  targetSpeechCode: string;
};

type DownloadOption = "source" | "translated" | "both";

type TranslationResponse = {
  source: string;
  translation: string;
  source_language: string;
  target_language: string;
};

const API =
  process.env.NEXT_PUBLIC_TRANSLATION_API ??
  "http://localhost:8000";

const LANGUAGES: Language[] = [
  { code: "eng_Latn", name: "English", speechCode: "en-US" },
  { code: "nya_Latn", name: "Chichewa", speechCode: "ny" },
  { code: "fra_Latn", name: "French", speechCode: "fr-FR" },
  { code: "zho_Hans", name: "Chinese (Simplified)", speechCode: "zh-CN" },
  { code: "zho_Hant", name: "Chinese (Traditional)", speechCode: "zh-TW" },
  { code: "hin_Deva", name: "Hindi", speechCode: "hi-IN" },
  { code: "ben_Beng", name: "Bengali", speechCode: "bn-BD" },
  { code: "tam_Taml", name: "Tamil", speechCode: "ta-IN" },
  { code: "tel_Telu", name: "Telugu", speechCode: "te-IN" },
  { code: "mar_Deva", name: "Marathi", speechCode: "mr-IN" },
  { code: "guj_Gujr", name: "Gujarati", speechCode: "gu-IN" },
  { code: "pan_Guru", name: "Punjabi", speechCode: "pa-IN" },
  { code: "urd_Arab", name: "Urdu", speechCode: "ur-PK" },
];

function getLanguage(code: string): Language {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}

function SparklesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2.5 14.2 8l5.3 2.2-5.3 2.2L12 18l-2.2-5.6L4.5 10.2 9.8 8 12 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 4.5v2.7M19.8 6.2h-2.6M5 16l1.2 2.3L8.5 19l-2.3 1.2L5 22.5l-1.2-2.3L1.5 19l2.3-1.2L5 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5c2.8 2.5 4.3 5.4 4.3 8.5S14.8 18 12 20.5C9.2 18 7.7 15.1 7.7 12S9.2 6 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicrophoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 11.5A6.5 6.5 0 0 0 18.5 11.5M12 18v3M8.5 21h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M20 7v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v-5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 9.5A6.5 6.5 0 0 1 18.2 9M17.8 14.5A6.5 6.5 0 0 1 5.8 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 18.5 3.5 20V6.8A2.8 2.8 0 0 1 6.3 4h11.4A2.8 2.8 0 0 1 20.5 6.8v8.4a2.8 2.8 0 0 1-2.8 2.8H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 9.2h8M8 12.8h5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5 18.5 6v5.3c0 4-2.8 7.7-6.5 9.2-3.7-1.5-6.5-5.2-6.5-9.2V6L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.4 12 1.6 1.6 3.6-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VolumeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 10.5v3h3.5l4 3.5V7l-4 3.5H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8 9.2a4.7 4.7 0 0 1 0 5.6M18.5 7a8.1 8.1 0 0 1 0 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [sourceCode, setSourceCode] = useState("eng_Latn");
  const [targetCode, setTargetCode] = useState("nya_Latn");
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [downloadOption, setDownloadOption] = useState<DownloadOption>("both");
  const [error, setError] = useState("");

  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const activeRef = useRef(false);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const nextId = useRef(0);
  const captureSectionRef = useRef<HTMLElement | null>(null);

  const sourceLanguage = getLanguage(sourceCode);
  const targetLanguage = getLanguage(targetCode);

  function scrollToCaptureSection() {
    captureSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function scrollToLatestCaption() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
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

    recognizer.lang = sourceLanguage.speechCode;
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
          const requestSourceCode = sourceCode;
          const requestTargetCode = targetCode;

          queueRef.current = queueRef.current
            .then(async () => {
              // Use the direction selected when this phrase was captured.
              await translatePhraseForLanguages(
                text,
                requestSourceCode,
                requestTargetCode
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
          `This browser does not support speech recognition for ${sourceLanguage.name}. Try a different browser or use a backend speech-recognition service.`
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

  async function translatePhraseForLanguages(
    text: string,
    selectedSourceCode: string,
    selectedTargetCode: string
  ) {
    const selectedSource = getLanguage(selectedSourceCode);
    const selectedTarget = getLanguage(selectedTargetCode);

    try {
      const response = await fetch(`${API}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          source_lang: selectedSourceCode,
          target_lang: selectedTargetCode,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.detail ?? `HTTP ${response.status}`);
      }

      const data: TranslationResponse = await response.json();

      setCaptions((previous) => [
        ...previous,
        {
          id: nextId.current++,
          sourceText: text,
          translatedText: data.translation,
          sourceLanguage: selectedSource.name,
          targetLanguage: selectedTarget.name,
          sourceSpeechCode: selectedSource.speechCode,
          targetSpeechCode: selectedTarget.speechCode,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(
        `Translation failed: ${message}. Check that the backend is running and supports the selected languages.`
      );
    }
  }

  function stopListening() {
    activeRef.current = false;
    recognizerRef.current?.stop();
    setListening(false);
    setInterim("");
  }

  function changeSourceLanguage(value: string) {
    if (listening) return;
    setSourceCode(value);
    if (value === targetCode) {
      setTargetCode(sourceCode);
    }
    setError("");
    setInterim("");
  }

  function changeTargetLanguage(value: string) {
    if (listening) return;
    setTargetCode(value);
    if (value === sourceCode) {
      setSourceCode(targetCode);
    }
    setError("");
    setInterim("");
  }

  function swapLanguages() {
    if (listening) return;
    setSourceCode(targetCode);
    setTargetCode(sourceCode);
    setError("");
    setInterim("");
  }

  function clearCaptions() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCaptions([]);
    setError("");
    nextId.current = 0;
  }

  function readTextAloud(text: string, languageCode: string) {
    if (!text.trim()) return;

    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is unavailable in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function shouldShowReadAloud(languageName: string) {
    return languageName.toLowerCase() !== "chichewa";
  }

  function downloadCaptionsAsPdf() {
    if (captions.length === 0) {
      setError("Add at least one caption before downloading a PDF.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Caption export", margin, 48);

    let y = 80;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    captions.forEach((caption, index) => {
      const blocks: string[] = [];

      if (downloadOption === "source" || downloadOption === "both") {
        blocks.push(`${caption.sourceLanguage}: ${caption.sourceText}`);
      }

      if (downloadOption === "translated" || downloadOption === "both") {
        blocks.push(`${caption.targetLanguage}: ${caption.translatedText}`);
      }

      const text = blocks.join("\n\n");
      const lines = doc.splitTextToSize(text, maxWidth);

      if (y + lines.length * lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}.`, margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.text(lines, margin, y);
      y += lines.length * lineHeight + 18;
    });

    doc.save(`captions-${downloadOption}.pdf`);
  }

  useEffect(() => {
    if (captions.length > 0) {
      window.setTimeout(() => {
        scrollToLatestCaption();
      }, 120);
    }
  }, [captions.length]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      recognizerRef.current?.abort();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(134,239,172,0.35),_rgba(255,255,255,0)_24%),linear-gradient(135deg,#ecfdf5_0%,#f8fafc_35%,#eef2ff_100%)] px-4 py-6 pb-28 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarNav />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white shadow-[0_14px_30px_rgba(16,185,129,0.38)]">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700">
                Live language translation
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Subtitle
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-2 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur-sm sm:flex">
            <GlobeIcon className="h-4 w-4" />
            {sourceLanguage.name} → {targetLanguage.name}
          </div>
        </header>

        <section
          ref={captureSectionRef}
          id="voice-capture"
          className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-[30px] border border-white/60 bg-white/70 p-4 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Translation mode
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Choose your language flow
                </h2>
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  listening
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    listening ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                {listening ? "Listening" : "Standby"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <label htmlFor="source-language" className="mb-2 block text-sm font-semibold text-slate-700">
                  Speak in
                </label>
                <select
                  id="source-language"
                  value={sourceCode}
                  disabled={listening}
                  onChange={(event) => changeSourceLanguage(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.code} value={item.code}>{item.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swapLanguages}
                disabled={listening}
                aria-label="Swap source and target languages"
                title="Swap languages"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ⇄ Swap
              </button>

              <div>
                <label htmlFor="target-language" className="mb-2 block text-sm font-semibold text-slate-700">
                  Translate to
                </label>
                <select
                  id="target-language"
                  value={targetCode}
                  disabled={listening}
                  onChange={(event) => changeTargetLanguage(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.code} value={item.code}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MicrophoneIcon className="h-4 w-4 text-emerald-600" />
                  Voice capture
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  {listening ? "Live" : "Idle"}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {listening
                  ? `Listening for ${sourceLanguage.name}. Stop listening before changing direction.`
                  : `Speak in ${sourceLanguage.name}; captions will appear in ${targetLanguage.name}.`}
              </p>

              {interim ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-3 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Hearing now
                  </p>
                  <p className="mt-2 text-base font-medium text-slate-700">
                    “{interim}”
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {!listening ? (
                <button
                  type="button"
                  onClick={startListening}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_32px_-15px_rgba(16,185,129,0.85)] transition hover:translate-y-[-1px] hover:shadow-[0_20px_35px_-15px_rgba(16,185,129,0.95)]"
                >
                  <MicrophoneIcon className="h-5 w-5" />
                  Start listening
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopListening}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_32px_-15px_rgba(239,68,68,0.8)] transition hover:translate-y-[-1px]"
                >
                  <RefreshIcon className="h-5 w-5" />
                  Stop listening
                </button>
              )}

              <button
                type="button"
                onClick={clearCaptions}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <MessageIcon className="h-5 w-5 text-slate-500" />
                Clear captions
              </button>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                <label htmlFor="download-option" className="text-sm font-medium text-slate-600">
                  Download
                </label>
                <select
                  id="download-option"
                  value={downloadOption}
                  onChange={(event) => setDownloadOption(event.target.value as DownloadOption)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="source">Source</option>
                  <option value="translated">Translated</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <button
                type="button"
                onClick={downloadCaptionsAsPdf}
                disabled={captions.length === 0}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Download PDF
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            {!supported && (
              <p className="mt-3 text-sm text-slate-600">
                Use a browser that supports the Web Speech API.
              </p>
            )}
          </div>

          <aside className="rounded-[30px] border border-white/60 bg-slate-900 p-4 text-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.6)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <ShieldIcon className="h-4 w-4" />
                Status
              </div>
              <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
                {listening ? "Live" : "Ready"}
              </span>
            </div>

            <div className="mt-5 rounded-[24px] bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Current direction
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {sourceLanguage.name} → {targetLanguage.name}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {listening
                  ? "The app is listening and translating in real time."
                  : "Press start to begin capturing live speech."}
              </p>
            </div>

            <div className="mt-5 rounded-[24px] bg-gradient-to-br from-emerald-500/20 to-cyan-400/10 p-4 ring-1 ring-emerald-300/20">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Quick note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Browser speech recognition may vary by device and language support. For important conversations, review the translated text before relying on it.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-8" aria-live="polite">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              {targetLanguage.name} captions
            </h2>
            <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              {captions.length} {captions.length === 1 ? "caption" : "captions"}
            </span>
          </div>

          {captions.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/60 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <MessageIcon className="h-7 w-7" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-700">
                Your translated captions will appear here.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Live spoken text will be translated into {targetLanguage.name} in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {captions.map((caption) => (
                <article
                  key={caption.id}
                  className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      {caption.sourceLanguage}
                    </p>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                      Live
                    </span>
                  </div>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <p className="text-base leading-relaxed text-slate-600">
                      {caption.sourceText}
                    </p>
                    {shouldShowReadAloud(caption.sourceLanguage) ? (
                      <button
                        type="button"
                        onClick={() => readTextAloud(caption.sourceText, caption.sourceSpeechCode)}
                        aria-label={`Read source caption aloud in ${caption.sourceLanguage}`}
                        title={`Read source caption aloud in ${caption.sourceLanguage}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <VolumeIcon className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 ring-1 ring-emerald-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                          {caption.targetLanguage}
                        </p>
                        <p className="mt-2 text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
                          {caption.translatedText}
                        </p>
                      </div>
                      {shouldShowReadAloud(caption.targetLanguage) ? (
                        <button
                          type="button"
                          onClick={() => readTextAloud(caption.translatedText, caption.targetSpeechCode)}
                          aria-label={`Read translated caption aloud in ${caption.targetLanguage}`}
                          title={`Read translated caption aloud in ${caption.targetLanguage}`}
                          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100"
                        >
                          <VolumeIcon className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-sm leading-6 text-slate-500">
          Translation is automated. Browser speech recognition may not support Chichewa reliably, so always review important conversations carefully.
        </footer>
      </div>

      <button
        type="button"
        onClick={scrollToCaptureSection}
        className="fixed bottom-5 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition hover:scale-[1.02] sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
        aria-label="Open voice capture section"
      >
        <MicrophoneIcon className="h-4 w-4" />
        Voice capture
      </button>
    </main>
  );
}