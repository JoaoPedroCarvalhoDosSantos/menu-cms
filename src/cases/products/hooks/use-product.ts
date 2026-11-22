import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import type { UpdateProductDto } from '../dtos/product.dto';

const KEY = ['products'];

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: [...KEY, categoryId ?? 'all'],
    queryFn: () => ProductService.listAll(categoryId),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      ProductService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
