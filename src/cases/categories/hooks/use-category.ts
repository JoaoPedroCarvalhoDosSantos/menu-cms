import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryService } from '../services/category.service';
import type { UpdateCategoryDto } from '../dtos/category.dto';

const KEY = ['categories'];

export function useCategories() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => CategoryService.listAll(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      CategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      // produtos exibem o nome da categoria
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
