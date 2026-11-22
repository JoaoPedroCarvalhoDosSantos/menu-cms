import type { GuestCheckDto } from '@/cases/guest-checks/dtos/guest-check.dto';
import type { ProductDto } from '@/cases/products/dtos/product.dto';

export const ORDER_STATUSES = ['NEW', 'PREPARING', 'READY', 'DELIVERED'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'Novo',
  PREPARING: 'Em preparo',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
};

export interface OrderItemDto {
  id: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
  product: ProductDto;
}

export interface OrderDto {
  id: string;
  createdAt: string;
  total: string | number;
  status: OrderStatus;
  guestCheck: GuestCheckDto;
  items: OrderItemDto[];
}
