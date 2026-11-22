import type { OrderDto } from '../dtos/order.dto';

// Soma o total dos pedidos (o total da comanda não vem pronto da API).
export function sumOrders(orders: OrderDto[]): number {
  return orders.reduce((acc, order) => acc + Number(order.total), 0);
}
