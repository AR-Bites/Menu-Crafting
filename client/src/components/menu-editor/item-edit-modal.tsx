import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { MenuItem } from "@shared/schema";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  image: z.string().optional(),
  model3d: z.string().optional(),
  isSpicy: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<MenuItem>) => Promise<void>;
  item?: MenuItem | null;
}

export function ItemEditModal({
  isOpen,
  onClose,
  onSave,
  item,
}: ItemEditModalProps) {
  const { t, isRTL } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: "",
      image: "",
      model3d: "",
      isSpicy: false,
      isVegetarian: false,
    },
  });

  useEffect(() => {
    if (item) {
      setValue("name", item.name || "");
      setValue("nameAr", item.nameAr || "");
      setValue("description", item.description || "");
      setValue("descriptionAr", item.descriptionAr || "");
      setValue("price", item.price?.toString() || "");
      setValue("image", item.image || "");
      setValue("model3d", item.model3d || "");
      setValue("isSpicy", item.isSpicy || false);
      setValue("isVegetarian", item.isVegetarian || false);
    }
  }, [item, setValue]);

  const onSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      await onSave({
        ...data,
        price: data.price,
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {item ? t('editor.editItem') : t('editor.addItem')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('editor.itemName')}</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder={t('editor.itemNamePlaceholder')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nameAr">{t('editor.itemNameAr')}</Label>
              <Input
                id="nameAr"
                {...register("nameAr")}
                placeholder={t('editor.itemNameArPlaceholder')}
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{t('editor.description')}</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={t('editor.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="descriptionAr">{t('editor.descriptionAr')}</Label>
              <Textarea
                id="descriptionAr"
                {...register("descriptionAr")}
                placeholder={t('editor.descriptionArPlaceholder')}
                rows={3}
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">{t('editor.price')}</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price")}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">{t('editor.imageUrl')}</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("isSpicy")}
                className="rounded"
              />
              <span className="text-sm">{t('editor.spicy')} 🌶️</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("isVegetarian")}
                className="rounded"
              />
              <span className="text-sm">{t('editor.vegetarian')} 🌱</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}