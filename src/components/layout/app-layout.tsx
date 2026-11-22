import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/categories', label: 'Categorias' },
  { to: '/products', label: 'Produtos' },
  { to: '/spots', label: 'Mesas' },
  { to: '/guest-checks', label: 'Comandas' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <span className="font-semibold">Cardápio CMS</span>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm text-muted-foreground hover:text-foreground',
                  isActive && 'font-medium text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
