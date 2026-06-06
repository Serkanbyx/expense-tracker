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
  
  const transactions = useTransactionStore((state) => state.transactions);
  const getSummary = useTransactionStore((state) => state.getSummary);
  const getRecentTransactions = useTransactionStore((state) => state.getRecentTransactions);
  const getCategoryChartData = useTransactionStore((state) => state.getCategoryChartData);
  const getMonthlyChartData = useTransactionStore((state) => state.getMonthlyChartData);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

  const summary = getSummary();
  const recentTransactions = getRecentTransactions(5);
  const expenseChartData = getCategoryChartData('expense');
  const monthlyChartData = getMonthlyChartData();

  const stats = [
    {
      label: 'Total Balance',
      value: formatCurrency(summary.balance),
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400',
      bgColor: summary.balance >= 0 ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-danger-100 dark:bg-danger-900/30',
    },
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      label: 'Total Expense',
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
            An overview of your financial status
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsFormOpen(true)}
        >
          New Transaction
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
          <CardHeader title="Monthly Trend" subtitle="Income vs expense over the last 6 months" />
          <ExpenseChart data={monthlyChartData} />
        </Card>

        {/* Category Distribution Chart */}
        <Card>
          <CardHeader title="Expense Distribution" subtitle="Spending by category" />
          <CategoryPieChart data={expenseChartData} />
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subtitle={`${transactions.length} transactions recorded`}
          action={
            transactions.length > 5 ? (
              <Link to="/transactions">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View All
                </Button>
              </Link>
            ) : undefined
          }
        />
        <TransactionList
          transactions={recentTransactions}
          onDelete={deleteTransaction}
          emptyMessage="No transactions added yet"
        />
      </Card>

      {/* Transaction Form Modal */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
