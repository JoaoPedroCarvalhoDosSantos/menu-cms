import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getErrorMessage } from '@/lib/errors';
import type { SpotDto } from '../dtos/spot.dto';
import { useCreateSpot, useUpdateSpot } from '../hooks/use-spot';

interface Props {
  spot: SpotDto | null; // null = cadastrar
  onClose: () => void;
}

export function SpotFormDialog({ spot, onClose }: Props) {
  const isEdit = spot !== null;

  const [name, setName] = useState(spot?.name ?? '');
  const [active, setActive] = useState(spot?.active ?? true);
  const [nameError, setNameError] = useState('');

  const createMutation = useCreateSpot();
  const updateMutation = useUpdateSpot();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) return setNameError('Informe o nome da mesa.');
    if (trimmed.length > 60) return setNameError('Máximo de 60 caracteres.');
    setNameError('');

    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? 'Mesa atualizada.' : 'Mesa cadastrada.');
        onClose();
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: spot.id, data: { name: trimmed, active } },
        callbacks,
      );
    } else {
      createMutation.mutate({ name: trimmed }, callbacks);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar mesa' : 'Nova mesa'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Altere os dados da mesa.'
                : 'Novas mesas são criadas como ativas.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="spot-name">Nome</Label>
            <Input
              id="spot-name"
              value={name}
              maxLength={60}
              placeholder="Ex.: Mesa 01"
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <Switch id="spot-active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="spot-active">{active ? 'Ativa' : 'Inativa'}</Label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
