import { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { Transaction } from '../../types';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export default function TransactionList({
  transactions,
  onDelete,
  emptyMessage = 'Henüz işlem yok',
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      onDelete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <Receipt className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm mt-1">Yeni bir işlem ekleyerek başlayın</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTransaction={editingTransaction}
      />
    </>
  );
}
