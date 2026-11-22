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
import type { ProductDto } from '../dtos/product.dto';
import { useDeleteProduct } from '../hooks/use-product';

interface Props {
  product: ProductDto;
  onClose: () => void;
}

export function ProductDeleteDialog({ product, onClose }: Props) {
  const deleteMutation = useDeleteProduct();

  function handleConfirm() {
    deleteMutation.mutate(product.id, {
      onSuccess: () => {
        toast.success('Produto excluído.');
        onClose();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir produto</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir o produto "{product.name}"? Esta ação não
            pode ser desfeita.
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
