"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, RefreshCw, RotateCcw} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useRef } from "react";
import Dropzone from "react-dropzone";
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BackButton } from "@/components/ui/back-botton";

const UploadCard = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSet = searchParams.get("set");
  const [isPending, startTransition] = useTransition();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
     const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadError: (error: Error) => {
    console.error("上傳發生錯誤:", error.message);
    alert("上傳失敗，請稍後再試");
  },
});

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop,
    rotation: number
  ): Promise<{ blob: Blob; url: string }> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = pixelCrop.width * scaleX;
    canvas.height = pixelCrop.height * scaleY;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY
    );
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve({ blob, url: URL.createObjectURL(blob) });
      }, "image/jpeg", 0.95);
    });
  };

  const handleShowPreview = async () => {
    if (!imgRef.current || !completedCrop) return;
    const { url } = await getCroppedImg(imgRef.current, completedCrop, rotation);
    setCroppedImageUrl(url);
    setIsCropped(true);
  };

  const handleFinalUpload = async () => {
    if (!croppedImageUrl) return;
    try {
    const id = searchParams.get("id"); 
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    
    await startUpload([file], { configId: id?? undefined }); 
  } catch (e) {
    console.error(e);
  }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto py-6">
      <style>{`
        .ReactCrop__crop-selection {
          border: 1.5px solid white !important;
          outline: 1px solid rgba(0,0,0,0.3) !important;
        }
        .ReactCrop__drag-bar {
          background-color: transparent !important;
          z-index: 10 !important;
        }
        .ReactCrop__drag-bar-n, .ReactCrop__drag-bar-s { height: 20px !important; margin-top: -10px !important; }
        .ReactCrop__drag-bar-e, .ReactCrop__drag-bar-w { width: 20px !important; margin-left: -10px !important; }
        .ReactCrop__drag-handle {
          width: 14px !important;
          height: 14px !important;
          background-color: white !important;
          border: 1.5px solid #556b2f !important;
          border-radius: 50% !important;
          z-index: 20 !important;
        }
      `}</style>
      <div className="mb-6">
      <BackButton/>
    </div>
      <div className="flex items-center gap-2 mb-2">
        
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
          Step 2
        </span>
        <h2 className="tracking-tight font-black text-3xl text-zinc-900">
          上傳照片
        </h2>
      </div>

      <div className="relative w-full rounded-2xl bg-white/70 ring-1 ring-zinc-200 overflow-hidden">
        {!imageUrl ? (
          <Dropzone 
            onDropAccepted={(files) => {
              const reader = new FileReader();
              reader.onload = () => setImageUrl(reader.result as string);
              reader.readAsDataURL(files[0]);
            }}
            accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div className={cn("h-[400px] w-full flex flex-col items-center justify-center cursor-pointer", isDragOver && "bg-primary/5")} {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="p-4 rounded-full bg-zinc-50 mb-4 text-zinc-400">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <p className="text-xl font-bold text-primary">上傳照片客製個人小卡</p>
                <div className="flex flex-col items-center gap-1 mt-3">
                  <p className="text-sm text-zinc-500">PNG, JPG, JPEG 格式</p>
                </div>
              </div>
            )}
          </Dropzone>
        ) : isCropped && croppedImageUrl ? (
          <div className="py-16 flex flex-col items-center bg-zinc-50/30">
            <h3 className="text-4xl font-bold mb-8 text-primary text-center">預覽您的客製卡片</h3>
            <div className="relative w-80 h-[450px] sm:w-90 sm:h-[520px] bg-[#fdfcfb] rounded-sm p-6 shadow-xl border border-zinc-100 flex flex-col overflow-hidden">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("/paper-texture.jpg")` }} />
              <div className="relative w-fit max-w-full mx-auto max-h-[250px] bg-white p-2 shadow-sm border border-zinc-400 rotate-1 mb-8 z-10 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full relative flex items-center justify-center bg-zinc-50/50">
                  <img src={croppedImageUrl} alt="preview" className="max-w-full max-h-full w-auto h-auto object-contain" />
                </div>
              </div>
              <div className="w-full flex-1 border-t border-dashed border-zinc-300 pt-20 flex flex-col justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-[1px] bg-zinc-100 w-full" />
                  <div className="h-[1px] bg-zinc-100 w-full" />
                  <div className="h-[1px] bg-zinc-100 w-3/4" />
                </div>
                <div className="pb-2 mt-4">
                  <p className="text-[7px] text-zinc-300 text-right mt-1">Vegan Festbox Eco-friendly Paper</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-16 w-full px-6 max-w-2xl mx-auto">
              <Button size="lg" variant="outline" onClick={() => { setIsCropped(false); setCroppedImageUrl(null); }} className="flex-1 cursor-pointer">返回調整</Button>
              <Button size="lg" onClick={handleFinalUpload} disabled={isUploading || isPending} loadingText="上傳中" className="flex-1 cursor-pointer">
                {(isUploading || isPending) ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "確認並上傳"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 lg:p-14">
            <div className="relative w-full max-w-[500px] aspect-square bg-zinc-900 rounded-3xl overflow-hidden flex items-center justify-center p-8 border border-zinc-800">
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
                <img ref={imgRef} src={imageUrl!} onLoad={onImageLoad} style={{ transform: `rotate(${rotation}deg)` }} className="max-w-[380px] max-h-[380px] w-auto h-auto transition-transform duration-100 select-none pointer-events-none" />
              </ReactCrop>
            </div>
            <div className="w-full max-w-[400px] mt-10 space-y-6">
              <div className="flex items-center justify-between text-sm font-medium text-zinc-600 px-1">
                <span className="flex items-center gap-2 font-bold"><RotateCcw className="w-4 h-4"/> 旋轉角度</span>
                <span className="font-mono bg-zinc-100 px-3 py-1 rounded-full">{rotation}°</span>
              </div>
              <Slider value={[rotation]} min={-180} max={180} step={1} onValueChange={(val) => setRotation(val[0])} className="cursor-pointer" />
              <div className="flex justify-center">
                 <Button variant="ghost" size="sm" onClick={() => setRotation(0)} className="text-s text-zinc-400 hover:text-zinc-600 cursor-pointer">重置角度</Button>
              </div>
            </div>
            <div className="w-full mt-12 flex justify-between items-center border-t pt-8">
              <Button variant="ghost" onClick={() => setImageUrl(null)} className="text-primary text-lg cursor-pointer">
                <RefreshCw className="w-4 h-4 mr-2" /> 重選照片
              </Button>
              <Button size="lg" onClick={handleShowPreview} className="px-10 cursor-pointer">預覽小卡效果</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;