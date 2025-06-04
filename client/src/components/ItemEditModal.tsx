import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: string;
  image?: string;
  model3d?: string;
}

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItem;
  onSave: (item: MenuItem) => void;
}

export function ItemEditModal({ isOpen, onClose, item, onSave }: ItemEditModalProps) {
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<MenuItem>(
    item || {
      id: 0,
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: "0.00",
      image: "",
      model3d: "",
    }
  );

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof MenuItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();
      
      // Check if it's a 3D model or image
      const is3DModel = file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf');
      
      setFormData(prev => ({
        ...prev,
        [is3DModel ? 'model3d' : 'image']: url,
      }));
      
      toast({
        title: "Success",
        description: `${is3DModel ? '3D model' : 'Image'} uploaded successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Error",
        description: "Valid price is required",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {item ? t('common.edit') : 'Add'} Menu Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.name')} (English)
            </Label>
            <Input 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          {/* Arabic Name */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.name')} (Arabic)
            </Label>
            <Input 
              value={formData.nameAr || ''}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              placeholder="اكتب اسم الطبق"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.description')} (English)
            </Label>
            <Textarea 
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter item description"
            />
          </div>

          {/* Arabic Description */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.description')} (Arabic)
            </Label>
            <Textarea 
              rows={3}
              value={formData.descriptionAr || ''}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              placeholder="اكتب وصف الطبق"
              dir="rtl"
            />
          </div>

          {/* Price */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.price')} ($)
            </Label>
            <Input 
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* File Upload */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              {t('common.image')} / 3D Model
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
              <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">
                Drag & drop an image or .glb file, or click to browse
              </p>
              <Button type="button" variant="outline" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <input 
                type="file" 
                accept="image/*,.glb,.gltf"
                className="hidden" 
                onChange={handleFileUpload}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer absolute inset-0" />
            </div>
            
            {/* 3D Model Info */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-amber-600 dark:text-amber-400">🔮</span>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  3D Model Support
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Upload .glb files to showcase your dishes in 3D!
              </p>
            </div>
          </div>

          {/* Preview */}
          {(formData.image || formData.model3d) && (
            <div>
              <Label className="block text-sm font-medium mb-2">Preview</Label>
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                {formData.model3d && (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    3D Model
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSave}
          >
            {t('common.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
