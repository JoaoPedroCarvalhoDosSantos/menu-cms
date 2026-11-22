import { Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { useOpenedGuestChecks } from '@/cases/guest-checks/hooks/use-guest-check';
import { OrderCard } from '@/cases/orders/components/order-card';
import { useGuestCheckOrders } from '@/cases/orders/hooks/use-order';
import { sumOrders } from '@/cases/orders/utils/order-total';
import { formatCurrency, formatDateTime } from '@/lib/format';

export function GuestCheckDetailPage() {
  const { id = '' } = useParams();
  const guestChecks = useOpenedGuestChecks();
  const orders = useGuestCheckOrders(id);

  const guestCheck = guestChecks.data?.find((g) => g.id === id);
  const isPending = guestChecks.isPending || orders.isPending;
  const isError = guestChecks.isError || orders.isError;

  return (
    <section className="grid gap-4">
      <div>
        <Link to="/guest-checks" className={buttonVariants({ variant: 'outline' })}>
          Voltar às comandas
        </Link>
      </div>

      {isPending && !isError && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando pedidos...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">Não foi possível carregar a comanda.</p>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                guestChecks.refetch();
                orders.refetch();
              }}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {guestChecks.data && orders.data && !guestCheck && (
        <p className="text-muted-foreground">
          Comanda não encontrada ou já encerrada.
        </p>
      )}

      {guestCheck && orders.data && (
        <>
          <header>
            <h1 className="text-xl font-semibold">
              Comanda — {guestCheck.spot.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Aberta em {formatDateTime(guestCheck.createdAt)} · Total acumulado:{' '}
              {formatCurrency(sumOrders(orders.data))}
            </p>
          </header>

          {orders.data.length === 0 ? (
            <p className="text-muted-foreground">
              Esta comanda ainda não tem pedidos.
            </p>
          ) : (
            <div className="grid gap-4">
              {orders.data.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
