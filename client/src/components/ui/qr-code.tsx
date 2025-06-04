import { useEffect, useRef } from "react";
import { Button } from "./button";
import { Download } from "lucide-react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  onDownload?: () => void;
}

export function QRCode({ value, size = 128, className = "", onDownload }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [value, size]);

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code pattern generator (for demo purposes)
    // In a real implementation, use a proper QR code library like qrcode
    const modules = 25; // QR code grid size
    const moduleSize = size / modules;
    
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Generate a simple pattern based on the value
    ctx.fillStyle = '#000000';
    
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Create a pseudo-random pattern based on value and position
        const hash = simpleHash(value + row + col);
        if (hash % 2 === 0) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
    
    // Add position markers (corners)
    drawPositionMarker(ctx, 0, 0, moduleSize);
    drawPositionMarker(ctx, (modules - 7) * moduleSize, 0, moduleSize);
    drawPositionMarker(ctx, 0, (modules - 7) * moduleSize, moduleSize);
  };

  const drawPositionMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Draw the 7x7 position marker
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'menu-qr-code.png';
    link.href = canvas.toDataURL();
    link.click();
    
    onDownload?.();
  };

  return (
    <div className={`text-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-slate-200 rounded-lg mx-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="mt-3"
      >
        <Download className="h-4 w-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
}
