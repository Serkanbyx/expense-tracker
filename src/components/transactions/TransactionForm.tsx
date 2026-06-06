import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionSchemaType } from '../../schemas/transactionSchema';
import { useTransactionStore } from '../../stores/transactionStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { getCurrentDate } from '../../utils/formatters';
import { Button, Input, Select, Modal } from '../ui';
import type { Transaction } from '../../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export default function TransactionForm({
  isOpen,
  onClose,
  editTransaction,
}: TransactionFormProps) {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const getCategoriesByType = useCategoryStore((state) => state.getCategoriesByType);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      category: '',
      description: '',
      date: getCurrentDate(),
    },
  });

  const selectedType = watch('type');
  const categories = getCategoriesByType(selectedType);

  // Reset form when opening/closing or editing
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        reset({
          type: editTransaction.type,
          amount: editTransaction.amount,
          category: editTransaction.category,
          description: editTransaction.description,
          date: editTransaction.date,
        });
      } else {
        reset({
          type: 'expense',
          amount: undefined,
          category: '',
          description: '',
          date: getCurrentDate(),
        });
      }
    }
  }, [isOpen, editTransaction, reset]);

  const onSubmit = (data: TransactionSchemaType) => {
    if (editTransaction) {
      updateTransaction(editTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'New Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Selection */}
        <div className="flex gap-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <>
                <button
                  type="button"
                  onClick={() => field.onChange('expense')}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200
                    ${
                      field.value === 'expense'
                        ? 'bg-danger-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('income')}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200
                    ${
                      field.value === 'income'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  Income
                </button>
              </>
            )}
          />
        </div>

        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              label="Amount ($)"
              placeholder="0.00"
              step="0.01"
              min="0"
              error={errors.amount?.message}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === '' ? undefined : parseFloat(value));
              }}
            />
          )}
        />

        {/* Category */}
        <Select
          label="Category"
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          error={errors.category?.message}
          {...register('category')}
        />

        {/* Date */}
        <Input
          type="date"
          label="Date"
          error={errors.date?.message}
          {...register('date')}
        />

        {/* Description */}
        <Input
          type="text"
          label="Description (Optional)"
          placeholder="Transaction description..."
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={selectedType === 'income' ? 'primary' : 'danger'}
            className="flex-1"
            isLoading={isSubmitting}
          >
            {editTransaction ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
