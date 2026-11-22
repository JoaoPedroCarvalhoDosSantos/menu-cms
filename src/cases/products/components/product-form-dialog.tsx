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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/cases/categories/hooks/use-category';
import { getErrorMessage } from '@/lib/errors';
import type { ProductDto } from '../dtos/product.dto';
import { useCreateProduct, useUpdateProduct } from '../hooks/use-product';

interface Props {
  product: ProductDto | null; // null = cadastrar
  onClose: () => void;
}

type Errors = Partial<
  Record<'name' | 'price' | 'categoryId' | 'picture', string>
>;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function ProductFormDialog({ product, onClose }: Props) {
  const isEdit = product !== null;

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(Number(product.price)) : '');
  const [picture, setPicture] = useState(product?.picture ?? '');
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? '');
  
  const [vegetarian, setVegetarian] = useState(product?.vegetarian ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [errors, setErrors] = useState<Errors>({});

  const categoriesQuery = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // A API só aceita categorias ativas; mantém a atual na lista para exibição.
  const categoryOptions = (categoriesQuery.data ?? [])
    .filter((c) => c.active || c.id === product?.category?.id)
    .map((c) => ({ value: c.id, label: c.name }));

  function validate(): Errors {
    const result: Errors = {};
    if (!name.trim()) result.name = 'Informe o nome do produto.';
    else if (name.trim().length > 60) result.name = 'Máximo de 60 caracteres.';

    const value = Number(price.replace(',', '.'));
    if (!price.trim() || Number.isNaN(value) || value <= 0) {
      result.price = 'O preço deve ser maior que zero.';
    } else if (Math.round(value * 100) / 100 !== value) {
      result.price = 'Use no máximo 2 casas decimais.';
    }

    if (!categoryId) result.categoryId = 'Selecione uma categoria.';

    if (picture.trim() && !isHttpUrl(picture.trim())) {
      result.picture = 'Informe uma URL válida (começando com http:// ou https://).';
    }
    return result;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const priceValue = Number(price.replace(',', '.'));
    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? 'Produto atualizado.' : 'Produto cadastrado.');
        onClose();
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    };

    if (isEdit) {
      updateMutation.mutate(
        {
          id: product.id,
          data: {
            name: name.trim(),
            description: description.trim(),
            price: priceValue,
            picture: picture.trim() || null,
            vegetarian,
            isNew,
            active,
            // só envia a categoria se mudou (a API rejeita categoria inativa)
            ...(categoryId !== product.category?.id && { categoryId }),
          },
        },
        callbacks,
      );
    } else {
      createMutation.mutate(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceValue,
          picture: picture.trim() || undefined,
          categoryId,
          vegetarian,
          isNew,
          active,
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
            <DialogTitle>{isEdit ? 'Editar produto' : 'Novo produto'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Altere os dados do produto.' : 'Preencha os dados do produto.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="product-name">Nome</Label>
            <Input
              id="product-name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="product-description">Descrição</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="product-price">Preço (R$)</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label>Categoria</Label>
              <Select
                value={categoryId}
                items={categoryOptions}
                onValueChange={(value) => setCategoryId(value ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoriesQuery.isError && (
                <p className="text-sm text-destructive">
                  Não foi possível carregar as categorias.
                </p>
              )}
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="product-picture">Imagem (URL)</Label>
            <Input
              id="product-picture"
              value={picture}
              placeholder="https://..."
              onChange={(e) => setPicture(e.target.value)}
            />
            {errors.picture && (
              <p className="text-sm text-destructive">{errors.picture}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch id="product-vegetarian" checked={vegetarian} onCheckedChange={setVegetarian} />
              <Label htmlFor="product-vegetarian">Vegetariano</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="product-new" checked={isNew} onCheckedChange={setIsNew} />
              <Label htmlFor="product-new">Novidade</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="product-active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="product-active">Ativo</Label>
            </div>
          </div>

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
