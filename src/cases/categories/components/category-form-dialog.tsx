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
import type { CategoryDto } from '../dtos/category.dto';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-category';

interface Props {
  category: CategoryDto | null; // null = cadastrar
  onClose: () => void;
}

type Errors = Partial<Record<'name' | 'icon' | 'displayOrder', string>>;

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function CategoryFormDialog({ category, onClose }: Props) {
  const isEdit = category !== null;

  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [displayOrder, setDisplayOrder] = useState(
    String(category?.displayOrder ?? 0),
  );
  const [active, setActive] = useState(category?.active ?? true);
  const [errors, setErrors] = useState<Errors>({});

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function validate(): Errors {
    const result: Errors = {};
    if (!name.trim()) result.name = 'Informe o nome da categoria.';
    else if (name.trim().length > 60) result.name = 'Máximo de 60 caracteres.';

    if (icon.trim() && !isValidUrl(icon.trim())) {
      result.icon = 'Informe uma URL válida (ex.: https://...).';
    }

    const order = Number(displayOrder);
    if (displayOrder.trim() === '' || !Number.isInteger(order) || order < 0) {
      result.displayOrder = 'Informe um número inteiro maior ou igual a 0.';
    }
    return result;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? 'Categoria atualizada.' : 'Categoria cadastrada.');
        onClose();
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    };

    if (isEdit) {
      updateMutation.mutate(
        {
          id: category.id,
          data: {
            name: name.trim(),
            icon: icon.trim() || null,
            displayOrder: Number(displayOrder),
            active,
          },
        },
        callbacks,
      );
    } else {
      createMutation.mutate(
        {
          name: name.trim(),
          icon: icon.trim() || undefined,
          displayOrder: Number(displayOrder),
        },
        callbacks,
      );
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Editar categoria' : 'Nova categoria'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Altere os dados da categoria.'
                : 'Novas categorias são criadas como ativas.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="category-icon">Ícone (URL da imagem)</Label>
            <Input
              id="category-icon"
              value={icon}
              placeholder="https://..."
              onChange={(e) => setIcon(e.target.value)}
            />
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="category-order">Ordem de exibição</Label>
            <Input
              id="category-order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
            {errors.displayOrder && (
              <p className="text-sm text-destructive">{errors.displayOrder}</p>
            )}
          </div>

          {isEdit && (
            <div className="flex items-center gap-2">
              <Switch
                id="category-active"
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="category-active">
                {active ? 'Ativa' : 'Inativa'}
              </Label>
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
