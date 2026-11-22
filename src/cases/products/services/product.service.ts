import { api } from '@/lib/axios';
import type {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dtos/product.dto';

const ENDPOINT = '/products';

export const ProductService = {
  // O CMS lista também os produtos inativos (includeInactive=true).
  async listAll(categoryId?: string): Promise<ProductDto[]> {
    const result = await api.get<ProductDto[]>(ENDPOINT, {
      params: { categoryId, includeInactive: true },
      
    });
    return result.data;
  },

  async findOne(id: string): Promise<ProductDto> {
    const result = await api.get<ProductDto>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async create(dto: CreateProductDto): Promise<ProductDto> {
    const result = await api.post<ProductDto>(ENDPOINT, dto);
    return result.data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const result = await api.patch<ProductDto>(`${ENDPOINT}/${id}`, dto);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
