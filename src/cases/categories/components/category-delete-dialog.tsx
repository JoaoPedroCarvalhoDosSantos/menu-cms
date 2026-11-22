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
import type { CategoryDto } from '../dtos/category.dto';
import { useDeleteCategory } from '../hooks/use-category';

interface Props {
  category: CategoryDto;
  onClose: () => void;
}

export function CategoryDeleteDialog({ category, onClose }: Props) {
  const deleteMutation = useDeleteCategory();

  function handleConfirm() {
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success('Categoria excluída.');
        onClose();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir categoria</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir a categoria "{category.name}"? Esta ação
            não pode ser desfeita.
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
