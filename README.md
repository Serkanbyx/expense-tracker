# 💰 Expense Tracker

A modern, user-friendly income and expense tracking application. Track your finances, analyze spending patterns with beautiful charts, and take control of your budget.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite)

## Features

- **Income/Expense Management**: Full CRUD operations - add, edit, and delete transactions with ease
- **Smart Categories**: Default and custom categories for better transaction classification
- **Interactive Charts**: Beautiful visualizations with Recharts (Pie, Bar, Area charts)
- **Advanced Filtering**: Filter by date range, transaction type, category, and search keywords
- **CSV Export**: Export filtered data to CSV format for external analysis
- **Responsive Design**: Fully mobile-optimized interface that works on any device
- **Dark Mode**: Eye-friendly dark theme support for comfortable viewing
- **Data Persistence**: Offline data storage with localStorage - no server required
- **Type Safety**: Built with TypeScript for reliable and maintainable code
- **Form Validation**: Robust validation using Zod schema validation

## Live Demo

[🎮 View Live Demo](https://expense-tracker-demo.netlify.app)

## Technologies

- **React 18**: Modern UI library with hooks and functional components
- **TypeScript**: Static type checking for enhanced developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Zustand**: Lightweight and flexible state management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Recharts**: Composable charting library for React
- **React Router DOM**: Client-side routing for single-page applications
- **Lucide React**: Beautiful and consistent icon library
- **date-fns**: Modern JavaScript date utility library
- **UUID**: Unique identifier generation for transactions

## Installation

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Serkanbyx/expense-tracker.git
cd expense-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Type check
npx tsc --noEmit
```

## Usage

1. **Add a New Transaction**: Click the "New Transaction" button in the header
2. **Select Transaction Type**: Choose between Income or Expense
3. **Fill in Details**: Enter amount, select category, pick date, and add description
4. **Save Transaction**: Click save to add the transaction to your list
5. **View Analytics**: Navigate to Dashboard to see charts and summaries
6. **Filter Transactions**: Use the filter bar to narrow down transactions
7. **Export Data**: Click the export button to download filtered data as CSV

## How It Works?

### State Management with Zustand

The application uses Zustand for state management with persistence middleware:

```typescript
// Transaction Store
const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [...state.transactions, transaction] 
        })),
      // ... more actions
    }),
    { name: 'transaction-storage' }
  )
);
```

### Form Validation with Zod

All forms are validated using Zod schemas:

```typescript
const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  description: z.string().optional(),
});
```

### Chart Visualizations

Interactive charts are built with Recharts:

- **Area Chart**: Monthly income vs expense trends
- **Pie Chart**: Category-wise expense distribution
- **Bar Chart**: Monthly comparison analysis

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Modal, Input, Card, Select)
│   ├── layout/          # Layout components (Header, Sidebar, Layout)
│   ├── transactions/    # Transaction components (Form, List, Item)
│   ├── categories/      # Category components (CategoryBadge)
│   ├── charts/          # Chart components (PieChart, BarChart, AreaChart)
│   └── filters/         # Filter components (FilterBar)
├── pages/
│   ├── Dashboard.tsx    # Main dashboard with analytics
│   └── Transactions.tsx # Transaction management page
├── stores/
│   ├── transactionStore.ts  # Transaction state management
│   ├── categoryStore.ts     # Category state management
│   └── filterStore.ts       # Filter state management
├── schemas/
│   └── transactionSchema.ts # Zod validation schemas
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── localStorage.ts  # LocalStorage helpers
│   ├── formatters.ts    # Date and currency formatters
│   └── exportCSV.ts     # CSV export functionality
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Customization

### Add Your Own Categories

You can customize categories in the category store:

```typescript
// src/stores/categoryStore.ts
const defaultExpenseCategories = [
  { id: '1', name: 'Food', type: 'expense', color: '#EF4444' },
  { id: '2', name: 'Transport', type: 'expense', color: '#F59E0B' },
  // Add your custom categories here
  { id: 'custom1', name: 'Subscriptions', type: 'expense', color: '#8B5CF6' },
];
```

### Change Currency Format

Modify the currency formatter in utils:

```typescript
// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Change to your currency (EUR, GBP, TRY, etc.)
  }).format(amount);
};
```

### Customize Theme Colors

Update Tailwind configuration for custom colors:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        // Add your custom colors
      },
    },
  },
};
```

## Features in Detail

### Completed Features

- ✅ Add, edit, and delete transactions
- ✅ Income and expense categorization
- ✅ Interactive dashboard with charts
- ✅ Date range filtering
- ✅ Category and type filtering
- ✅ Search functionality
- ✅ CSV data export
- ✅ Dark mode support
- ✅ Responsive design
- ✅ LocalStorage persistence

### Future Features

- [ ] 🔮 Multi-currency support
- [ ] 🔮 Budget goals and alerts
- [ ] 🔮 Recurring transactions
- [ ] 🔮 Bank account sync
- [ ] 🔮 Receipt image upload
- [ ] 🔮 Cloud synchronization
- [ ] 🔮 Monthly/yearly reports
- [ ] 🔮 Multi-language support

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3. **Commit your changes**

```bash
git commit -m "feat: add amazing feature"
```

4. **Push to the branch**

```bash
git push origin feature/amazing-feature
```

5. **Open a Pull Request**

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Serkan Bayraktar**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- [React](https://react.dev/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Recharts](https://recharts.org/) - Charting Library
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Lucide Icons](https://lucide.dev/) - Icon Library
- [Vite](https://vitejs.dev/) - Build Tool

## Contact

Have questions or suggestions? Feel free to reach out!

- Create an [Issue](https://github.com/Serkanbyx/expense-tracker/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com)

---

⭐ If you like this project, don't forget to give it a star!
