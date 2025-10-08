import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}: DrawerProps) {
  const positionClasses = {
    right: 'right-0',
    left: 'left-0',
  };
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-screen',
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-hidden"
        onClose={onClose}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* <Dialog.Overlay className="absolute inset-0 bg-black/75 backdrop-blur-sm" /> */}
          </Transition.Child>

          <div className="fixed inset-y-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo={position === 'right' ? 'translate-x-full' : '-translate-x-full'}
            >
              <div className={`relative w-screen ${sizeClasses[size]} ${positionClasses[position]}`}>
                <div className="h-full flex flex-col bg-gray-800 border-l border-gray-700 shadow-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    {title && (
                      <Dialog.Title className="text-lg font-medium text-white">
                        {title}
                      </Dialog.Title>
                    )}
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white 
                        hover:bg-gray-700/50 transition-colors"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}