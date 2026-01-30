import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryChartData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CategoryPieChartProps {
  data: CategoryChartData[];
  title?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryChartData }>;
  total: number;
}

interface PieLegendProps {
  payload?: Array<{ value: string; color: string }>;
}

/**
 * Generates accessible description for pie chart data
 */
function generateChartDescription(data: CategoryChartData[], total: number): string {
  const descriptions = data.map((item) => {
    const percentage = ((item.value / total) * 100).toFixed(1);
    return `${item.name}: ${formatCurrency(item.value)} (%${percentage})`;
  });
  return `Kategori dağılımı: ${descriptions.join(', ')}. Toplam: ${formatCurrency(total)}`;
}

/**
 * Custom tooltip component for pie chart
 */
function PieChartTooltip({ active, payload, total }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const percentage = ((item.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(item.value)} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Custom legend component for pie chart
 */
function PieChartLegend({ payload }: PieLegendProps) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload?.map((entry, index) => (
        <li key={index} className="flex items-center gap-1.5 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-gray-600 dark:text-gray-400">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>Veri bulunamadı</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartDescription = generateChartDescription(data, total);

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
        <caption>{title || 'Kategori Dağılımı'}</caption>
        <thead>
          <tr>
            <th scope="col">Kategori</th>
            <th scope="col">Tutar</th>
            <th scope="col">Yüzde</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{formatCurrency(item.value)}</td>
              <td>{((item.value / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<PieChartTooltip total={total} />} />
          <Legend content={<PieChartLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
