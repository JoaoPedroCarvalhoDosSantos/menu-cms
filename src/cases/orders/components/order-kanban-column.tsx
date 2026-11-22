import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { OrderDto, OrderStatus } from '../dtos/order.dto';
import { OrderKanbanCard } from './order-kanban-card';
import { OrderStatusBadge } from './order-status-badge';

interface Props {
  status: OrderStatus;
  orders: OrderDto[];
}

export function OrderKanbanColumn({ status, orders }: Props) {
  // o id da coluna é o próprio status, usado ao soltar o cartão
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex min-h-64 flex-col gap-3 rounded-lg border bg-muted/40 p-3',
        isOver && 'ring-2 ring-primary',
      )}
    >
      <header className="flex items-center justify-between">
        <OrderStatusBadge status={status} />
        <span className="text-sm text-muted-foreground">{orders.length}</span>
      </header>

      <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto">
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum pedido.</p>
        ) : (
          orders.map((order) => <OrderKanbanCard key={order.id} order={order} />)
        )}
      </div>
    </section>
  );
}
