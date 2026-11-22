import type { CategoryDto } from '@/cases/categories/dtos/category.dto';

export interface ProductDto {
  id: string;
  name: string;
  description?: string | null;
  price: string | number; // numeric do Postgres chega como string
  active: boolean;
  vegetarian: boolean;
  isNew: boolean;
  picture?: string | null;
  category: CategoryDto | null;
  
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  active?: boolean;
  picture?: string;
  vegetarian?: boolean;
  isNew?: boolean;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'picture'>> {
  picture?: string | null; // null limpa a imagem
}
