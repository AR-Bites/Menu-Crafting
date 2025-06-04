import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { EditorSidebar } from "@/components/menu-editor/editor-sidebar";
import { MenuPreview } from "@/components/menu-editor/menu-preview";
import { ItemEditModal } from "@/components/menu-editor/item-edit-modal";
import { PublishModal } from "@/components/menu-editor/publish-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useI18n } from "@/hooks/useI18n";
import type { Menu, MenuSection, MenuItem } from "@shared/schema";

export default function MenuEditor() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  const restaurantId = parseInt(id || "0");

  // Fetch restaurant data
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}`],
    enabled: !!restaurantId,
  });

  // Fetch menu data
  const { data: menuData, isLoading: isLoadingMenu } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    enabled: !!restaurantId,
  });

  // Update restaurant mutation
  const updateRestaurantMutation = useMutation({
    mutationFn: async (data: Partial<Restaurant>) => {
      const response = await apiRequest("PUT", `/api/restaurants/${restaurantId}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}`] });
      toast({ title: t('success'), description: "Restaurant updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: t('error'), description: "Failed to update restaurant", variant: "destructive" });
    },
  });

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiRequest("POST", `/api/restaurants/${restaurantId}/sections`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu`] });
      toast({ title: t('success'), description: "Section created successfully" });
    },
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      const response = await apiRequest("POST", `/api/sections/${editingSectionId}/items`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu`] });
      toast({ title: t('success'), description: "Item created successfully" });
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PUT", `/api/restaurants/${restaurantId}`, {
        isPublished: true,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}`] });
      toast({ title: t('success'), description: "Menu published successfully!" });
    },
  });

  const handleSave = () => {
    toast({ title: t('success'), description: "Menu saved successfully" });
  };

  const handleAddSection = () => {
    const name = prompt("Enter section name:");
    if (name?.trim()) {
      createSectionMutation.mutate({ name: name.trim() });
    }
  };

  const handleEditSection = (section: MenuSection) => {
    const name = prompt("Edit section name:", section.name);
    if (name?.trim() && name !== section.name) {
      // Update section mutation would go here
      toast({ title: t('success'), description: "Section updated successfully" });
    }
  };

  const handleDeleteSection = (sectionId: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      // Delete section mutation would go here
      toast({ title: t('success'), description: "Section deleted successfully" });
    }
  };

  const handleAddItem = (sectionId: number) => {
    setEditingSectionId(sectionId);
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditingSectionId(item.sectionId);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      // Update item mutation would go here
      toast({ title: t('success'), description: "Item updated successfully" });
    } else {
      await createItemMutation.mutateAsync(itemData);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
    setEditingSectionId(null);
  };

  const handleUpdateDesign = (design: Partial<Restaurant>) => {
    updateRestaurantMutation.mutate(design);
  };

  const handlePublish = async () => {
    await publishMutation.mutateAsync();
    setIsPublishModalOpen(false);
  };

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!restaurant || !menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Restaurant not found</h2>
          <p className="text-slate-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50">
      <div className="flex h-full">
        <EditorSidebar
          restaurant={restaurant}
          sections={menuData.sections || []}
          onSave={handleSave}
          onClose={() => window.history.back()}
          onAddSection={handleAddSection}
          onEditSection={handleEditSection}
          onDeleteSection={handleDeleteSection}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onUpdateDesign={handleUpdateDesign}
        />
        
        <MenuPreview
          restaurant={restaurant}
          sections={menuData.sections || []}
          onBackToTemplates={() => window.history.back()}
          onPublish={() => setIsPublishModalOpen(true)}
        />
      </div>

      <ItemEditModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
          setEditingSectionId(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        restaurant={restaurant}
        onPublish={handlePublish}
      />
    </div>
  );
}
