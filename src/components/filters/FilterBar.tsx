import { Search, X, Calendar } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { Button, Input, Select } from '../ui';

interface FilterBarProps {
  showTypeFilter?: boolean;
  showCategoryFilter?: boolean;
  showDateFilter?: boolean;
  showSearchFilter?: boolean;
}

export default function FilterBar({
  showTypeFilter = true,
  showCategoryFilter = true,
  showDateFilter = true,
  showSearchFilter = true,
}: FilterBarProps) {
  const { filters, setType, setCategory, setDateRange, clearDateRange, setSearchQuery, resetFilters } =
    useFilterStore();
  const categories = useCategoryStore((state) => state.categories);

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== null ||
    filters.dateRange !== null ||
    filters.searchQuery !== '';

  const typeOptions = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: `${cat.name} (${cat.type === 'income' ? 'Income' : 'Expense'})`,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        {showSearchFilter && (
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                filters.searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
        )}

        {/* Type Filter */}
        {showTypeFilter && (
          <div className="w-full sm:w-auto min-w-[140px]">
            <Select
              options={typeOptions}
              value={filters.type}
              onChange={(e) => setType(e.target.value as 'all' | 'income' | 'expense')}
              placeholder="Type"
            />
          </div>
        )}

        {/* Category Filter */}
        {showCategoryFilter && (
          <div className="w-full sm:w-auto min-w-[180px]">
            <Select
              options={categoryOptions}
              value={filters.category || ''}
              onChange={(e) => setCategory(e.target.value || null)}
              placeholder="Category"
            />
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      {showDateFilter && (
        <div className="flex flex-wrap items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => {
                const start = e.target.value;
                const end = filters.dateRange?.end || start;
                if (start) {
                  setDateRange(start, end);
                } else {
                  clearDateRange();
                }
              }}
              className="w-auto"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => {
                const end = e.target.value;
                const start = filters.dateRange?.start || end;
                if (end) {
                  setDateRange(start, end);
                } else {
                  clearDateRange();
                }
              }}
              className="w-auto"
            />
          </div>
          {filters.dateRange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateRange}
              className="text-gray-500"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Reset Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-primary-600 dark:text-primary-400"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
