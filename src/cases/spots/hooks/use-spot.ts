import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SpotService } from '../services/spot.service';
import type { UpdateSpotDto } from '../dtos/spot.dto';

const KEY = ['spots'];

export function useSpots() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => SpotService.listAll(),
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SpotService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpotDto }) =>
      SpotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      // comandas e pedidos exibem o nome da mesa
      queryClient.invalidateQueries({ queryKey: ['guest-checks'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SpotService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
