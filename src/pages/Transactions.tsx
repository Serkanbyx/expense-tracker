import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useTransactionStore } from '../stores/transactionStore';
import { useFilterStore } from '../stores/filterStore';
import { exportTransactionsToCSV } from '../utils/exportCSV';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TransactionForm, TransactionList } from '../components/transactions';
import { FilterBar } from '../components/filters';

export default function Transactions() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getFilteredTransactions = useTransactionStore((state) => state.getFilteredTransactions);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const getSummary = useTransactionStore((state) => state.getSummary);
  const filters = useFilterStore((state) => state.filters);

  const filteredTransactions = getFilteredTransactions(filters);
  const summary = getSummary(filteredTransactions);

  const handleExportCSV = () => {
    exportTransactionsToCSV(filteredTransactions);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İşlemler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm gelir ve giderlerinizi yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
          >
            CSV İndir
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsFormOpen(true)}
          >
            Yeni İşlem
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader title="Filtreler" subtitle="İşlemlerinizi filtreleyin" />
        <FilterBar />
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
          <p className="text-sm text-primary-600 dark:text-primary-400">Filtrelenmiş Gelir</p>
          <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
            +{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.totalIncome)}
          </p>
        </div>
        <div className="bg-danger-50 dark:bg-danger-900/20 rounded-xl p-4">
          <p className="text-sm text-danger-600 dark:text-danger-400">Filtrelenmiş Gider</p>
          <p className="text-xl font-bold text-danger-700 dark:text-danger-300">
            -{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.totalExpense)}
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net Bakiye</p>
          <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400'}`}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(summary.balance)}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader
          title={`İşlem Listesi (${filteredTransactions.length})`}
          subtitle="Tüm işlemleriniz tarihe göre sıralanmış"
        />
        <TransactionList
          transactions={filteredTransactions}
          onDelete={deleteTransaction}
          emptyMessage="Filtrelere uygun işlem bulunamadı"
        />
      </Card>

      {/* Transaction Form Modal */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
