import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true,
  showCloseButton = true,
  width = 'md',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 遮罩层 */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* 模态框内容 */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`relative w-full ${widthStyles[width]} rounded-2xl shadow-xl z-10`}
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* 头部 */}
            {(title || showCloseButton) && (
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: '#E5E7EB' }}
              >
                {title && (
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: '#1F2937' }}
                  >
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="关闭"
                  >
                    <X size={18} style={{ color: '#6B7280' }} />
                  </button>
                )}
              </div>
            )}

            {/* 内容 */}
            <div className="px-6 py-4" style={{ color: '#1F2937' }}>
              {children}
            </div>

            {/* 底部操作区 */}
            {footer && (
              <div
                className="flex items-center justify-end gap-3 px-6 py-4 border-t"
                style={{ borderColor: '#E5E7EB' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
