import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency } from '../utils/formatters';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TransactionForm, TransactionList } from '../components/transactions';
import { CategoryPieChart, ExpenseChart } from '../components/charts';

export default function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Zustand store selectors - optimized by Zustand internally
  const transactions = useTransactionStore((state) => state.transactions);
  const getSummary = useTransactionStore((state) => state.getSummary);
  const getRecentTransactions = useTransactionStore((state) => state.getRecentTransactions);
  const getCategoryChartData = useTransactionStore((state) => state.getCategoryChartData);
  const getMonthlyChartData = useTransactionStore((state) => state.getMonthlyChartData);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

  // Computed values from store selectors
  const summary = getSummary();
  const recentTransactions = getRecentTransactions(5);
  const expenseChartData = getCategoryChartData('expense');
  const monthlyChartData = getMonthlyChartData();

  const stats = [
    {
      label: 'Toplam Bakiye',
      value: formatCurrency(summary.balance),
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400',
      bgColor: summary.balance >= 0 ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-danger-100 dark:bg-danger-900/30',
    },
    {
      label: 'Toplam Gelir',
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      label: 'Toplam Gider',
      value: formatCurrency(summary.totalExpense),
      icon: TrendingDown,
      color: 'text-danger-600 dark:text-danger-400',
      bgColor: 'bg-danger-100 dark:bg-danger-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Finansal durumunuza genel bakış
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsFormOpen(true)}
        >
          Yeni İşlem
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader title="Aylık Trend" subtitle="Son 6 aylık gelir-gider karşılaştırması" />
          <ExpenseChart data={monthlyChartData} />
        </Card>

        {/* Category Distribution Chart */}
        <Card>
          <CardHeader title="Gider Dağılımı" subtitle="Kategorilere göre harcamalar" />
          <CategoryPieChart data={expenseChartData} />
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader
          title="Son İşlemler"
          subtitle={`${transactions.length} işlem kayıtlı`}
          action={
            transactions.length > 5 ? (
              <Link to="/transactions">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Tümünü Gör
                </Button>
              </Link>
            ) : undefined
          }
        />
        <TransactionList
          transactions={recentTransactions}
          onDelete={deleteTransaction}
          emptyMessage="Henüz işlem eklenmemiş"
        />
      </Card>

      {/* Transaction Form Modal */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
