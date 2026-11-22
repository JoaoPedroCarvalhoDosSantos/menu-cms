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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
