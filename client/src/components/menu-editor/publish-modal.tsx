import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import type { Menu } from "@shared/schema";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Menu;
  onPublish: () => Promise<void>;
}

export function PublishModal({
  isOpen,
  onClose,
  restaurant,
  onPublish,
}: PublishModalProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const shareUrl = restaurant.shareSlug 
    ? `${window.location.origin}/menu/${restaurant.shareSlug}`
    : "";

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      toast({
        title: t('common.success'),
        description: t('editor.menuPublished'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('editor.publishError'),
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.copied'),
      description: t('editor.linkCopied'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{t('editor.publishMenu')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!restaurant.isPublished ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                {t('editor.publishDescription')}
              </p>
              
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full"
              >
                {isPublishing ? t('common.publishing') : t('editor.publishNow')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="shareUrl">{t('editor.shareUrl')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="shareUrl"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(shareUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{t('editor.qrCode')}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {t('editor.qrCodeDescription')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  {t('common.close')}
                </Button>
                <Button 
                  onClick={() => window.open(shareUrl, '_blank')} 
                  className="flex-1"
                >
                  {t('editor.viewMenu')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}