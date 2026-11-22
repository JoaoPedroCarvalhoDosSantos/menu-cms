import { useDraggable } from '@dnd-kit/core';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { OrderDto } from '../dtos/order.dto';

// Aparência do cartão (também usada no DragOverlay enquanto arrasta).
export function OrderKanbanCardView({
  order,
  className,
}: {
  order: OrderDto;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-1.5 rounded-md border bg-card p-3 text-sm shadow-xs',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{order.guestCheck.spot.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(order.createdAt)}
        </span>
      </div>
      <ul className="text-muted-foreground">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.product.name}
          </li>
        ))}
      </ul>
      <span className="font-medium">{formatCurrency(order.total)}</span>
    </div>
  );
}

export function OrderKanbanCard({ order }: { order: OrderDto }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn('cursor-grab touch-none', isDragging && 'opacity-40')}
    >
      <OrderKanbanCardView order={order} />
    </div>
  );
}
