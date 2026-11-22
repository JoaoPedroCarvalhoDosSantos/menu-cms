import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getErrorMessage } from '@/lib/errors';
import { formatCurrency, formatDateTime } from '@/lib/format';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  type OrderDto,
  type OrderStatus,
} from '../dtos/order.dto';
import { useUpdateOrderStatus } from '../hooks/use-order';
import { OrderStatusBadge } from './order-status-badge';

const STATUS_ITEMS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABEL[status],
}));

export function OrderCard({ order }: { order: OrderDto }) {
  const updateStatus = useUpdateOrderStatus();

  function handleChange(status: OrderStatus | null) {
    if (!status || status === order.status) return;

    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          toast.success(`Pedido alterado para "${ORDER_STATUS_LABEL[status]}".`),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <article className="grid gap-3 rounded-lg border p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <Select
            value={order.status}
            items={STATUS_ITEMS}
            disabled={updateStatus.isPending}
            onValueChange={handleChange}
          >
            <SelectTrigger className="w-40" aria-label="Alterar status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Qtd.</TableHead>
            <TableHead>Preço unit.</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.subtotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <footer className="text-right font-semibold">
        Total do pedido: {formatCurrency(order.total)}
      </footer>
    </article>
  );
}
