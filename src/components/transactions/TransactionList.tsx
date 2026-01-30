import { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { Transaction } from '../../types';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';
import { ConfirmModal } from '../ui';

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
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
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTransaction={editingTransaction}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="İşlemi Sil"
        message="Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        variant="danger"
      />
    </>
  );
}
