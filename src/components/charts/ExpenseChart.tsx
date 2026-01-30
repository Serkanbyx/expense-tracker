import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { MonthlyChartData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseChartProps {
  data: MonthlyChartData[];
  title?: string;
}

interface FormattedChartData extends MonthlyChartData {
  monthLabel: string;
  balance: number;
}

interface AreaTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

/**
 * Generates accessible description for area chart data
 */
function generateChartDescription(data: FormattedChartData[]): string {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  return `Gelir ve gider trendi: Toplam gelir ${formatCurrency(totalIncome)}, Toplam gider ${formatCurrency(totalExpense)}. ${data.length} aylık veri gösteriliyor.`;
}

/**
 * Custom tooltip component for area chart
 */
function AreaChartTooltip({ active, payload, label }: AreaTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry, index) => {
          const labels: Record<string, string> = {
            income: 'Gelir',
            expense: 'Gider',
            balance: 'Bakiye',
          };
          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {labels[entry.dataKey] || entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
}

export default function ExpenseChart({ data, title }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>Veri bulunamadı</p>
      </div>
    );
  }

  // Format month labels and calculate balance
  const formattedData: FormattedChartData[] = data.map((item) => ({
    ...item,
    monthLabel: format(parseISO(`${item.month}-01`), 'MMM yyyy', { locale: tr }),
    balance: item.income - item.expense,
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
        <caption>{title || 'Aylık Gelir/Gider Trendi'}</caption>
        <thead>
          <tr>
            <th scope="col">Ay</th>
            <th scope="col">Gelir</th>
            <th scope="col">Gider</th>
            <th scope="col">Bakiye</th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((item, index) => (
            <tr key={index}>
              <td>{item.monthLabel}</td>
              <td>{formatCurrency(item.income)}</td>
              <td>{formatCurrency(item.expense)}</td>
              <td>{formatCurrency(item.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<AreaChartTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
