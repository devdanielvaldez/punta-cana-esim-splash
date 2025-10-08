import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
}

export default function DropdownMenu({
  trigger,
  items,
  align = 'right',
}: DropdownMenuProps) {
  const alignments = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        {trigger}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`
            absolute z-40 ${alignments[align]} mt-2
            bg-gray-800 border border-gray-700
            rounded-md shadow-lg focus:outline-none
            w-56 py-1
          `}
        >
          {items.map((item, index) => (
            <Menu.Item key={index} disabled={item.disabled}>
              {({ active }) => (
                <button
                  onClick={item.onClick}
                  className={`
                    ${active ? 'bg-gray-700' : ''}
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    group flex items-center w-full text-left
                    px-4 py-2 text-sm text-white
                  `}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <span className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}