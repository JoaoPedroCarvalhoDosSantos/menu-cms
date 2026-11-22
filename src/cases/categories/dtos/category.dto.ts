export interface CategoryDto {
  id: string;
  name: string;
  icon?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  displayOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string | null; // null limpa o ícone
  active?: boolean;
  displayOrder?: number;
}
