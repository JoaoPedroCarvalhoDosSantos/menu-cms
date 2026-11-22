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
import { CategoryDeleteDialog } from '@/cases/categories/components/category-delete-dialog';
import { CategoryFormDialog } from '@/cases/categories/components/category-form-dialog';
import type { CategoryDto } from '@/cases/categories/dtos/category.dto';
import { useCategories } from '@/cases/categories/hooks/use-category';

type FormState = { open: false } | { open: true; category: CategoryDto | null };

export function CategoriesPage() {
  const { data: categories, isPending, isError, refetch } = useCategories();
  const [form, setForm] = useState<FormState>({ open: false });
  const [toDelete, setToDelete] = useState<CategoryDto | null>(null);

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorias</h1>
        <Button onClick={() => setForm({ open: true, category: null })}>
          <Plus /> Nova categoria
        </Button>
      </div>

      {isPending && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando categorias...
        </p>
      )}

      {isError && (
        <div className="grid gap-2">
          <p className="text-destructive">
            Não foi possível carregar as categorias.
          </p>
          <div>
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {categories && categories.length === 0 && (
        <p className="text-muted-foreground">Nenhuma categoria cadastrada.</p>
      )}

      {categories && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={`Ícone de ${category.name}`}
                      className="size-8 object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.displayOrder}</TableCell>
                <TableCell>
                  <Badge variant={category.active ? 'default' : 'secondary'}>
                    {category.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ open: true, category })}
                    >
                      <Pencil /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setToDelete(category)}
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
        <CategoryFormDialog
          key={form.category?.id ?? 'new'}
          category={form.category}
          onClose={() => setForm({ open: false })}
        />
      )}

      {toDelete && (
        <CategoryDeleteDialog
          category={toDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
