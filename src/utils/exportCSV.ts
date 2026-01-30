import type { Transaction } from '../types';
import { useCategoryStore } from '../stores/categoryStore';
import { formatDate } from './formatters';

/**
 * Convert transactions to CSV format and trigger download
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  if (transactions.length === 0) {
    alert('Dışa aktarılacak işlem bulunamadı.');
    return;
  }

  const categoryStore = useCategoryStore.getState();

  // CSV headers
  const headers = ['Tarih', 'Tip', 'Kategori', 'Tutar', 'Açıklama', 'Oluşturulma Tarihi'];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => {
    const category = categoryStore.getCategoryById(t.category);
    return [
      formatDate(t.date, 'dd/MM/yyyy'),
      t.type === 'income' ? 'Gelir' : 'Gider',
      category?.name || t.category,
      t.amount.toFixed(2),
      `"${(t.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
      formatDate(t.createdAt, 'dd/MM/yyyy HH:mm'),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.join(';')),
  ].join('\n');

  // Add BOM for Excel Turkish character support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Generate filename with current date
  const today = new Date().toISOString().split('T')[0];
  const filename = `expense-tracker-${today}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export summary statistics to CSV
 */
export function exportSummaryToCSV(
  totalIncome: number,
  totalExpense: number,
  balance: number
): void {
  const headers = ['Metrik', 'Değer'];
  const rows = [
    ['Toplam Gelir', totalIncome.toFixed(2)],
    ['Toplam Gider', totalExpense.toFixed(2)],
    ['Net Bakiye', balance.toFixed(2)],
  ];

  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.join(';')),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0];
  const filename = `expense-tracker-summary-${today}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
