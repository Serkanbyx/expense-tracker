import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { MonthlyChartData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyBarChartProps {
  data: MonthlyChartData[];
  title?: string;
}

interface FormattedBarData extends MonthlyChartData {
  monthLabel: string;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

/**
 * Generates accessible description for bar chart data
 */
function generateChartDescription(data: FormattedBarData[]): string {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  return `Aylık karşılaştırma: Toplam gelir ${formatCurrency(totalIncome)}, Toplam gider ${formatCurrency(totalExpense)}. ${data.length} aylık veri gösteriliyor.`;
}

/**
 * Custom tooltip component for bar chart
 */
function BarChartTooltip({ active, payload, label }: BarTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === 'income' ? 'Gelir' : 'Gider'}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function MonthlyBarChart({ data, title }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>Veri bulunamadı</p>
      </div>
    );
  }

  // Format month labels
  const formattedData: FormattedBarData[] = data.map((item) => ({
    ...item,
    monthLabel: format(parseISO(`${item.month}-01`), 'MMM', { locale: tr }),
  }));

  const chartDescription = generateChartDescription(formattedData);

  return (
    <div
      role="img"
      aria-label={title ? `${title} - ${chartDescription}` : chartDescription}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      {/* Screen reader only data table */}
      <table className="sr-only">
        <caption>{title || 'Aylık Gelir/Gider Karşılaştırması'}</caption>
        <thead>
          <tr>
            <th scope="col">Ay</th>
            <th scope="col">Gelir</th>
            <th scope="col">Gider</th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((item, index) => (
            <tr key={index}>
              <td>{item.monthLabel}</td>
              <td>{formatCurrency(item.income)}</td>
              <td>{formatCurrency(item.expense)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<BarChartTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {value === 'income' ? 'Gelir' : 'Gider'}
              </span>
            )}
          />
          <Bar dataKey="income" name="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
