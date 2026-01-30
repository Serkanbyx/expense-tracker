import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import Button from './Button';

type ConfirmModalVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmModalVariant;
  isLoading?: boolean;
}

/**
 * Accessible confirmation modal component
 * Replaces window.confirm() with a proper accessible dialog
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management and keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus cancel button initially (safer default)
      setTimeout(() => cancelButtonRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmButton: 'danger' as const,
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      confirmButton: 'primary' as const,
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmButton: 'primary' as const,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all">
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} aria-hidden="true" />
            </div>

            {/* Title */}
            <h3
              id="confirm-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h3>

            {/* Message */}
            <p
              id="confirm-modal-description"
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <Button
            ref={cancelButtonRef}
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={config.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'İşleniyor...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
