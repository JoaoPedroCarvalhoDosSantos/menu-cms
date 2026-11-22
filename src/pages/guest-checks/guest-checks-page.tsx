import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOpenedGuestChecks } from '@/cases/guest-checks/hooks/use-guest-check';
import { useOrders } from '@/cases/orders/hooks/use-order';
import { sumOrders } from '@/cases/orders/utils/order-total';
import { formatCurrency, formatDateTime } from '@/lib/format';

export function GuestChecksPage() {
  const navigate = useNavigate();
  const guestChecks = useOpenedGuestChecks();
  const orders = useOrders(); // usado para somar o valor de cada comanda

  const isPending = guestChecks.isPending || orders.isPending;
  const isError = guestChecks.isError || orders.isError;

  function refetch() {
    guestChecks.refetch();
    orders.refetch();
  }

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Comandas em aberto</h1>

      {isPending && !isError && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando comandas...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">Não foi possível carregar as comandas.</p>
          <div>
            <Button variant="outline" onClick={refetch}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {guestChecks.data && orders.data && guestChecks.data.length === 0 && (
        <p className="text-muted-foreground">Nenhuma comanda em aberto.</p>
      )}

      {guestChecks.data && orders.data && guestChecks.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mesa</TableHead>
              <TableHead>Aberta em</TableHead>
              <TableHead>Total acumulado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestChecks.data.map((guestCheck) => {
              const total = sumOrders(
                orders.data.filter((o) => o.guestCheck.id === guestCheck.id),
              );
              return (
                <TableRow key={guestCheck.id}>
                  <TableCell className="font-medium">
                    {guestCheck.spot.name}
                  </TableCell>
                  <TableCell>{formatDateTime(guestCheck.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(total)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/guest-checks/${guestCheck.id}`)}
                    >
                      Ver pedidos
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
