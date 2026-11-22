import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import type { OrderDto, OrderStatus } from '../dtos/order.dto';

const KEY = ['orders'];

export function useOrders() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => OrderService.listAll(),
  });
}

// Pedidos de uma comanda (a API lista todos; filtramos no cliente, no mesmo cache)
export function useGuestCheckOrders(guestCheckId: string) {
  return useQuery({
    queryKey: KEY,
    queryFn: () => OrderService.listAll(),
    select: (orders: OrderDto[]) =>
      orders.filter((order) => order.guestCheck.id === guestCheckId),
    enabled: !!guestCheckId,
  });
}

// Atualiza a tela na hora (otimista), grava na API e desfaz se der erro.
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<OrderDto[]>(KEY);
      queryClient.setQueryData<OrderDto[]>(KEY, (old) =>
        old?.map((order) => (order.id === id ? { ...order, status } : order)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
