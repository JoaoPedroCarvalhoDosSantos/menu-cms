import { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategories } from '@/cases/categories/hooks/use-category';
import { ProductDeleteDialog } from '@/cases/products/components/product-delete-dialog';
import { ProductFormDialog } from '@/cases/products/components/product-form-dialog';
import type { ProductDto } from '@/cases/products/dtos/product.dto';
import { useProducts } from '@/cases/products/hooks/use-product';
import { formatCurrency } from '@/lib/format';

const ALL = 'all';

type FormState = { open: false } | { open: true; product: ProductDto | null };

export function ProductsPage() {
  const [filter, setFilter] = useState(ALL);
  const {
    data: products,
    isPending,
    isError,
    refetch,
  } = useProducts(filter === ALL ? undefined : filter);
  const categoriesQuery = useCategories();

  const [form, setForm] = useState<FormState>({ open: false });
  const [toDelete, setToDelete] = useState<ProductDto | null>(null);

  const filterItems = [
    { value: ALL, label: 'Todas as categorias' },
    ...(categoriesQuery.data ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Produtos</h1>
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            items={filterItems}
            onValueChange={(value) => setFilter(value ?? ALL)}
          >
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setForm({ open: true, product: null })}>
            <Plus /> Novo produto
          </Button>
        </div>
      </div>

      {isPending && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando produtos...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">Não foi possível carregar os produtos.</p>
          <div>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {products && products.length === 0 && (
        <p className="text-muted-foreground">
          {filter === ALL
            ? 'Nenhum produto cadastrado.'
            : 'Nenhum produto nesta categoria.'}
        </p>
      )}

      {products && products.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Indicadores</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.picture ? (
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="size-12 rounded object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name ?? '—'}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.vegetarian && <Badge variant="secondary">Vegetariano</Badge>}
                    {product.isNew && <Badge>Novidade</Badge>}
                    {!product.vegetarian && !product.isNew && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.active ? 'default' : 'secondary'}>
                    {product.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ open: true, product })}
                    >
                      <Pencil /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setToDelete(product)}
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
        <ProductFormDialog
          key={form.product?.id ?? 'new'}
          product={form.product}
          onClose={() => setForm({ open: false })}
        />
      )}

      {toDelete && (
        <ProductDeleteDialog product={toDelete} onClose={() => setToDelete(null)} />
      )}
    </section>
  );
}
