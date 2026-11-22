import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_LABEL, type OrderStatus } from '../dtos/order.dto';

// Uma cor diferente para cada status.
const STATUS_STYLE: Record<OrderStatus, string> = {
  NEW: 'border-transparent bg-blue-100 text-blue-800',
  PREPARING: 'border-transparent bg-amber-100 text-amber-800',
  READY: 'border-transparent bg-green-100 text-green-800',
  DELIVERED: 'border-transparent bg-gray-200 text-gray-700',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLE[status]}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
