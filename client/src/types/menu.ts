export interface MenuDesignConfig {
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'rose';
  fontFamily: 'inter' | 'serif' | 'sans';
  spacing: 1 | 2 | 3 | 4 | 5;
  headerStyle: 'image' | 'gradient' | 'solid';
}

export interface MenuItemExtra {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
}

export interface FullMenu {
  menu: {
    id: number;
    name: string;
    restaurantName: string;
    tagline: string;
    headerImage?: string;
    designConfig?: MenuDesignConfig;
    isPublished: boolean;
    shareSlug?: string;
  };
  sections: Array<{
    id: number;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    sortOrder: number;
    items: Array<{
      id: number;
      name: string;
      nameAr?: string;
      description?: string;
      descriptionAr?: string;
      price: string;
      image?: string;
      model3d?: string;
      extras?: MenuItemExtra[];
      isAvailable: boolean;
      isSpicy: boolean;
      isVegetarian: boolean;
      sortOrder: number;
    }>;
  }>;
}

export type DragItemType = 'section' | 'item';

export interface DragItem {
  type: DragItemType;
  id: number;
  index: number;
  sectionId?: number;
}
