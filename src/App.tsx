import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import NotFound from './pages/NotFound';

/**
 * Route constants for type-safe navigation
 */
export const ROUTES = {
  DASHBOARD: '/',
  TRANSACTIONS: '/transactions',
} as const;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
