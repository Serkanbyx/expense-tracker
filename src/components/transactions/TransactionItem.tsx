import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import CategoryBadge from '../categories/CategoryBadge';
import Button from '../ui/Button';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${
            isIncome
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
          }
        `}
      >
        {isIncome ? (
          <TrendingUp className="w-5 h-5" />
        ) : (
          <TrendingDown className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge categoryId={transaction.category} size="sm" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(transaction.date)}
          </span>
        </div>
        {transaction.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {transaction.description}
          </p>
        )}
      </div>

      {/* Amount */}
      <div
        className={`
          font-semibold text-lg
          ${
            isIncome
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-danger-600 dark:text-danger-400'
          }
        `}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={() => onEdit(transaction)}
          aria-label="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
          onClick={() => onDelete(transaction.id)}
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
