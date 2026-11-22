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
import { getErrorMessage } from '@/lib/errors';
import type { SpotDto } from '../dtos/spot.dto';
import { useDeleteSpot } from '../hooks/use-spot';

interface Props {
  spot: SpotDto;
  onClose: () => void;
}

export function SpotDeleteDialog({ spot, onClose }: Props) {
  const deleteMutation = useDeleteSpot();

  function handleConfirm() {
    deleteMutation.mutate(spot.id, {
      onSuccess: () => {
        toast.success('Mesa excluída.');
        onClose();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir mesa</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir a mesa "{spot.name}"? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleConfirm}
          >
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
