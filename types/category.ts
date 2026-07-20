export interface MealCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string; // from Swagger
  icon?: string; // from Frontend suggestions
  displayOrder: number;
  active: boolean; // from Swagger
  isActive?: boolean; // alias
  mealCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string; // from Swagger
  displayOrder: number;
  active?: boolean;
}
