"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { Modal } from "./Modal";
import { getCroppedImg } from "@/lib/imageUtils";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Check, X } from "lucide-react";

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  aspect?: number;
  shape?: "rect" | "round";
}

export function CropModal({
  isOpen,
  onClose,
  image,
  onCropComplete,
  aspect = 1,
  shape = "rect",
}: CropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedImage) {
        onCropComplete(croppedImage);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Image"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-on-surface/60 hover:text-on-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="relative w-full h-[400px] bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            cropShape={shape}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            classes={{
              containerClassName: "bg-surface-container-high",
              mediaClassName: "opacity-100",
            }}
          />
        </div>

        <div className="space-y-4 px-2 pb-2">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-outline" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <ZoomIn className="w-4 h-4 text-outline" />
          </div>

          {/* Rotation Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface/70">Rotation</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((prev) => (prev - 90) % 360)}
                className="p-2 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors cursor-pointer"
                title="Rotate Left"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono w-12 text-center text-outline">
                {rotation}°
              </span>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 hover:bg-surface-container-high rounded-lg text-outline hover:text-primary transition-colors cursor-pointer"
                title="Rotate Right"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
