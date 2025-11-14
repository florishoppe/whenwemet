'use client';

import { useState, useRef, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (photo: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Kan camera niet openen. Controleer je toestemmingen.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setPhoto(photoData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (photo) {
      onCapture(photo);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-[#F97068] font-medium">{error}</p>
        <button
          onClick={startCamera}
          className="btn-primary rounded-full px-6 py-3 transition-all hover:scale-105"
        >
          OPNIEUW PROBEREN
        </button>
      </div>
    );
  }

  if (photo) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative overflow-hidden rounded-lg border-2 border-[#F97068]/50 neon-border">
          <img src={photo} alt="Captured" className="max-h-[60vh] w-auto" />
        </div>
        <div className="flex gap-4">
          <button
            onClick={retakePhoto}
            className="btn-secondary rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            OPNIEUW
          </button>
          <button
            onClick={confirmPhoto}
            className="btn-primary rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            BEVESTIG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative overflow-hidden rounded-lg border-2 border-[#F97068]/50 bg-[#060404] neon-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="max-h-[60vh] w-auto"
        />
      </div>
      <button
        onClick={capturePhoto}
        className="btn-primary rounded-full px-8 py-4 text-lg transition-all hover:scale-105"
      >
        NEEM FOTO
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

