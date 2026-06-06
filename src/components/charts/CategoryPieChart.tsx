import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryChartData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CategoryPieChartProps {
  data: CategoryChartData[];
  title?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryChartData; percent?: number }>;
}

function CustomTooltip({ active, payload }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const { payload: item, percent } = payload[0];
    const percentage = ((percent ?? 0) * 100).toFixed(1);
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

interface PieLegendProps {
  payload?: Array<{ value: string; color: string }>;
}

function CustomLegend({ payload }: PieLegendProps) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
      {payload?.map((entry, index) => (
        <li key={index} className="flex items-center gap-1.5 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
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
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
