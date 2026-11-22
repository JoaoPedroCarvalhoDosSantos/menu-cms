import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { OrderKanbanCardView } from '@/cases/orders/components/order-kanban-card';
import { OrderKanbanColumn } from '@/cases/orders/components/order-kanban-column';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from '@/cases/orders/dtos/order.dto';
import { useOrders, useUpdateOrderStatus } from '@/cases/orders/hooks/use-order';
import { getErrorMessage } from '@/lib/errors';

export function OrdersPage() {
  const { data: orders, isPending, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  // só começa a arrastar depois de mover 5px (permite clicar no cartão)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeOrder = orders?.find((order) => order.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const order = orders?.find((o) => o.id === active.id);
    const status = over.id as OrderStatus;
    if (!order || order.status === status) return;

    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          toast.success(`Pedido movido para "${ORDER_STATUS_LABEL[status]}".`),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Pedidos</h1>

      {isPending && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando pedidos...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">Não foi possível carregar os pedidos.</p>
          <div>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {orders && orders.length === 0 && (
        <p className="text-muted-foreground">Nenhum pedido registrado.</p>
      )}

      {orders && orders.length > 0 && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ORDER_STATUSES.map((status) => (
              <OrderKanbanColumn
                key={status}
                status={status}
                orders={orders.filter((order) => order.status === status)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeOrder ? (
              <OrderKanbanCardView order={activeOrder} className="shadow-lg" />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </section>
  );
}
