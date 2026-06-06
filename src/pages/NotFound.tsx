import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

/**
 * 404 Not Found page component
 * Displays when user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Icon/Number */}
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
          404
        </h1>
        
        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
          You can return to the home page to continue.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Home
            </Button>
          </Link>
          
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
