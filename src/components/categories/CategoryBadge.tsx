import {
  Utensils,
  Car,
  Receipt,
  Gamepad2,
  HeartPulse,
  ShoppingBag,
  MoreHorizontal,
  Wallet,
  Laptop,
  TrendingUp,
  Gift,
  Tag,
} from 'lucide-react';
import { useCategoryStore } from '../../stores/categoryStore';

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  car: Car,
  receipt: Receipt,
  'gamepad-2': Gamepad2,
  'heart-pulse': HeartPulse,
  'shopping-bag': ShoppingBag,
  'more-horizontal': MoreHorizontal,
  wallet: Wallet,
  laptop: Laptop,
  'trending-up': TrendingUp,
  gift: Gift,
  tag: Tag,
};

interface CategoryBadgeProps {
  categoryId: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({
  categoryId,
  showIcon = true,
  size = 'md',
}: CategoryBadgeProps) {
  const getCategoryById = useCategoryStore((state) => state.getCategoryById);
  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        {categoryId}
      </span>
    );
  }

  const Icon = iconMap[category.icon] || Tag;
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizes[size]}
      `}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
      }}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {category.name}
    </span>
  );
}
