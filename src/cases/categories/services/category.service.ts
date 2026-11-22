import { api } from '@/lib/axios';
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dtos/category.dto';

const ENDPOINT = '/categories';

export const CategoryService = {
  async listAll(): Promise<CategoryDto[]> {
    const result = await api.get<CategoryDto[]>(ENDPOINT);
    return result.data;
  },

  async findOne(id: string): Promise<CategoryDto> {
    const result = await api.get<CategoryDto>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async create(dto: CreateCategoryDto): Promise<CategoryDto> {
    const result = await api.post<CategoryDto>(ENDPOINT, dto);
    return result.data;
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto> {
    const result = await api.patch<CategoryDto>(`${ENDPOINT}/${id}`, dto);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
