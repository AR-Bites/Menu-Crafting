import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import type { FullMenu } from "@/types/menu";
import { Share, Copy, Download } from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: FullMenu;
}

export function PublishModal({ isOpen, onClose, menu }: PublishModalProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  // Generate share URL (in real app, this would use the actual domain)
  const shareUrl = menu.menu.shareSlug 
    ? `${window.location.origin}/menu/${menu.menu.shareSlug}`
    : `${window.location.origin}/menu/preview-${menu.menu.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Success",
        description: "Link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    // In a real app, this would generate and download a QR code
    toast({
      title: "QR Code",
      description: "QR code download will be available soon!",
    });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // In a real app, this would update the menu's published status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Success",
        description: "Menu published successfully!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish menu",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Share className="text-white text-2xl" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {t('publish.title')}
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              {t('publish.subtitle')}
            </p>
          </div>
        </DialogHeader>

        {/* Shareable Link */}
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-2">
            {t('publish.shareableLink')}
          </Label>
          <div className="flex items-center space-x-2">
            <Input 
              value={shareUrl}
              readOnly
              className="flex-1 bg-muted text-muted-foreground"
            />
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-6 text-center">
          <Label className="block text-sm font-medium mb-3">
            {t('publish.qrCode')}
          </Label>
          <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center border border-border">
            {/* QR code placeholder */}
            <div className="w-24 h-24 bg-foreground/10 rounded-sm grid grid-cols-8 gap-px">
              {[...Array(64)].map((_, i) => (
                <div 
                  key={i}
                  className={`${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                />
              ))}
            </div>
          </div>
          <Button 
            variant="link" 
            size="sm"
            className="mt-3"
            onClick={handleDownloadQR}
          >
            <Download className="h-4 w-4 mr-1" />
            {t('publish.downloadQR')}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            {t('publish.close')}
          </Button>
          <Button 
            className="flex-1 bg-accent hover:bg-accent/90"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <Share className="mr-2 h-4 w-4" />
            {isPublishing ? 'Publishing...' : t('publish.share')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
