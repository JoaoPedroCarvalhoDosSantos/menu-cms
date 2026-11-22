import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AppLayout } from './components/layout/app-layout';
import { CategoriesPage } from './pages/categories/categories-page';
import { ProductsPage } from './pages/products/products-page';
import { SpotsPage } from './pages/spots/spots-page';
import { GuestChecksPage } from './pages/guest-checks/guest-checks-page';
import { GuestCheckDetailPage } from './pages/guest-checks/guest-check-detail-page';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="categories" replace />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="spots" element={<SpotsPage />} />
          <Route path="guest-checks" element={<GuestChecksPage />} />
          <Route path="guest-checks/:id" element={<GuestCheckDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
