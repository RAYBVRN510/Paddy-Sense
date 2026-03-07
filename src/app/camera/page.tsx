"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ScanResult {
  id: string;
  disease: string;
  confidence: number;
  image: string;
  date: Date;
  severity: "low" | "medium" | "high";
}

export default function CameraPage() {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push("/login");
    }
  }, [isAuthReady, user, router]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isBackCamera ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const flipCamera = () => {
    stopCamera();
    setIsBackCamera(!isBackCamera);
    setTimeout(() => startCamera(), 100);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      stopCamera();
      analyzeImage(imageData);
    }
  };

  const analyzeImage = (imageData: string) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const diseases = ["Brown Spot", "Leaf Blast", "Bacterial Blight", "Healthy"];
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = 85 + Math.floor(Math.random() * 15);
      const severityLevels: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
      const randomSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];

      const scanResult: ScanResult = {
        id: Date.now().toString(),
        disease: randomDisease,
        confidence,
        image: imageData,
        date: new Date(),
        severity: randomSeverity,
      };

      setResult(scanResult);
      setIsAnalyzing(false);

      const history = JSON.parse(localStorage.getItem("scanHistory") || "[]");
      history.unshift(scanResult);
      localStorage.setItem("scanHistory", JSON.stringify(history));
    }, 2000);
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  };

  if (!isAuthReady) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="surface p-6 text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="surface p-5 sm:p-6">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Disease Detector</h1>
        <p className="mt-2 text-sm text-slate-600">Point your camera at a rice leaf and capture a clear frame for analysis.</p>
      </header>

      <section className="surface overflow-hidden">
        <div className="relative aspect-[4/5] w-full bg-slate-900 sm:aspect-video">
          {!isCameraActive && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button onClick={startCamera} className="btn-primary w-full max-w-xs">
                Start Camera
              </button>
            </div>
          )}

          {isCameraActive && (
            <>
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                Align leaf in frame
              </div>

              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
                  <button
                    onClick={flipCamera}
                    className="inline-flex items-center justify-center rounded-full bg-black/55 p-3 text-white transition hover:bg-black/70"
                    aria-label="Flip camera"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>

                  <button
                    onClick={captureImage}
                    className="inline-flex items-center justify-center rounded-full bg-white p-4 text-green-700 shadow-lg transition hover:bg-slate-100"
                    aria-label="Capture image"
                  >
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 p-3 text-white transition hover:bg-red-700"
                    aria-label="Stop camera"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {capturedImage && !isAnalyzing && !result && (
            <Image src={capturedImage} alt="Captured leaf" fill className="object-cover" />
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 p-6 text-center">
              <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
              <p className="text-sm font-medium text-white sm:text-base">Analyzing image...</p>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-4 p-4 sm:p-6">
            <Image
              src={result.image}
              alt="Analyzed leaf"
              width={640}
              height={360}
              className="h-52 w-full rounded-xl object-cover sm:h-64"
            />
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{result.disease}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  result.severity === "high"
                    ? "bg-red-100 text-red-700"
                    : result.severity === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {result.severity} severity
              </span>
            </div>
            <p className="text-sm text-slate-600">Confidence: {result.confidence}%</p>
            <button onClick={resetCamera} className="btn-primary w-full sm:w-auto">
              Scan Another Leaf
            </button>
          </div>
        )}

        {isCameraActive && (
          <div className="border-t border-slate-200 bg-green-50/80 px-4 py-3 text-xs text-green-800 sm:text-sm">
            Tip: Keep lighting bright and hold the phone steady for better results.
          </div>
        )}
      </section>
    </div>
  );
}
