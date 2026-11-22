import { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SpotDeleteDialog } from '@/cases/spots/components/spot-delete-dialog';
import { SpotFormDialog } from '@/cases/spots/components/spot-form-dialog';
import type { SpotDto } from '@/cases/spots/dtos/spot.dto';
import { useSpots } from '@/cases/spots/hooks/use-spot';

type FormState = { open: false } | { open: true; spot: SpotDto | null };

export function SpotsPage() {
  const { data: spots, isPending, isError, refetch } = useSpots();
  const [form, setForm] = useState<FormState>({ open: false });
  const [toDelete, setToDelete] = useState<SpotDto | null>(null);

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mesas</h1>
        <Button onClick={() => setForm({ open: true, spot: null })}>
          <Plus /> Nova mesa
        </Button>
      </div>

      {isPending && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando mesas...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">Não foi possível carregar as mesas.</p>
          <div>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {spots && spots.length === 0 && (
        <p className="text-muted-foreground">Nenhuma mesa cadastrada.</p>
      )}

      {spots && spots.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell className="font-medium">{spot.name}</TableCell>
                <TableCell>
                  <Badge variant={spot.active ? 'default' : 'secondary'}>
                    {spot.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ open: true, spot })}
                    >
                      <Pencil /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setToDelete(spot)}
                    >
                      <Trash2 /> Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {form.open && (
        <SpotFormDialog
          key={form.spot?.id ?? 'new'}
          spot={form.spot}
          onClose={() => setForm({ open: false })}
        />
      )}

      {toDelete && (
        <SpotDeleteDialog spot={toDelete} onClose={() => setToDelete(null)} />
      )}
    </section>
  );
}
