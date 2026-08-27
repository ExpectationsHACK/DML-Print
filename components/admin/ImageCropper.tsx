"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_W = 360;
const FRAME_H = 270; // 4:3, matches ProductMockup's aspect ratio
const OUTPUT_W = 1200;
const OUTPUT_H = 900;

type ImageState = {
  img: HTMLImageElement;
  scale: number; // on top of the base "cover" scale
  offsetX: number; // top-left of the image, in frame pixels
  offsetY: number;
};

function baseCoverScale(img: HTMLImageElement): number {
  return Math.max(FRAME_W / img.naturalWidth, FRAME_H / img.naturalHeight);
}

function clampOffset(state: ImageState): ImageState {
  const scale = baseCoverScale(state.img) * state.scale;
  const dispW = state.img.naturalWidth * scale;
  const dispH = state.img.naturalHeight * scale;
  const minX = FRAME_W - dispW;
  const minY = FRAME_H - dispH;
  return {
    ...state,
    offsetX: Math.min(0, Math.max(minX, state.offsetX)),
    offsetY: Math.min(0, Math.max(minY, state.offsetY)),
  };
}

export function ImageCropper({
  name,
  existingImage,
}: {
  /** Name of the hidden file input the cropped result is submitted under. */
  name: string;
  existingImage?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const [state, setState] = useState<ImageState | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoomInput, setZoomInput] = useState(1);

  function draw(s: ImageState) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = baseCoverScale(s.img) * s.scale;
    ctx.clearRect(0, 0, FRAME_W, FRAME_H);
    ctx.drawImage(
      s.img,
      s.offsetX,
      s.offsetY,
      s.img.naturalWidth * scale,
      s.img.naturalHeight * scale
    );
  }

  useEffect(() => {
    if (state) draw(state);
  }, [state]);

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const initial = clampOffset({ img, scale: 1, offsetX: 0, offsetY: 0 });
      // Center the image in the frame on load.
      const scale = baseCoverScale(img);
      const dispW = img.naturalWidth * scale;
      const dispH = img.naturalHeight * scale;
      const centered = clampOffset({
        ...initial,
        offsetX: (FRAME_W - dispW) / 2,
        offsetY: (FRAME_H - dispH) / 2,
      });
      setState(centered);
      setZoomInput(1);
      setPreview(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current || !state) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setState(clampOffset({ ...state, offsetX: state.offsetX + dx, offsetY: state.offsetY + dy }));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function handleZoom(value: number) {
    if (!state) return;
    setZoomInput(value);
    setState(clampOffset({ ...state, scale: value }));
  }

  function useThisPhoto() {
    if (!state) return;
    const output = document.createElement("canvas");
    output.width = OUTPUT_W;
    output.height = OUTPUT_H;
    const ctx = output.getContext("2d");
    if (!ctx) return;
    const ratio = OUTPUT_W / FRAME_W;
    const scale = baseCoverScale(state.img) * state.scale * ratio;
    ctx.drawImage(
      state.img,
      state.offsetX * ratio,
      state.offsetY * ratio,
      state.img.naturalWidth * scale,
      state.img.naturalHeight * scale
    );
    output.toBlob(
      (blob) => {
        if (!blob || !fileInputRef.current) return;
        const file = new File([blob], "product.jpg", { type: "image/jpeg" });
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        setPreview(URL.createObjectURL(blob));
        setState(null);
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" name={name} className="hidden" />

      {!state && (
        <div className="flex items-center gap-4">
          {(preview || existingImage) && (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL / arbitrary existing product image, not an allowlisted remote host
            <img
              src={preview ?? existingImage}
              alt="Current product"
              className="h-20 w-20 rounded-md object-cover"
            />
          )}
          <div>
            <input
              ref={pickRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadFile(file);
                e.target.value = "";
              }}
              className="w-full rounded-[var(--radius-control)] border-2 border-line bg-surface px-3 py-2.5 text-sm"
            />
            <p className="mt-1.5 text-xs text-ink-soft">
              Choose a photo, then crop it to fit — {preview ? "cropped and ready." : "nothing new selected yet."}
            </p>
          </div>
        </div>
      )}

      {state && (
        <div className="border-2 border-line p-3">
          <canvas
            ref={canvasRef}
            width={FRAME_W}
            height={FRAME_H}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="cursor-move touch-none rounded-md bg-surface-sunken"
            style={{ width: FRAME_W, height: FRAME_H }}
          />
          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="crop-zoom" className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Zoom
            </label>
            <input
              id="crop-zoom"
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoomInput}
              onChange={(e) => handleZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <p className="mt-1 text-xs text-ink-soft">Drag the photo to reposition it.</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={useThisPhoto}
              className="rounded-[var(--radius-control)] bg-lime px-4 py-2 text-sm font-bold text-ink hover:bg-lime-strong"
            >
              Use this photo
            </button>
            <button
              type="button"
              onClick={() => setState(null)}
              className="text-sm font-semibold text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
