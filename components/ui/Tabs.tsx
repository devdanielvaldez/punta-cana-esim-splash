interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }
  
  interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'pills' | 'underline';
  }
  
  export default function Tabs({
    tabs,
    activeTab,
    onChange,
    variant = 'pills',
  }: TabsProps) {
    const variants = {
      pills: {
        container: 'bg-gray-800/50 p-1 rounded-lg',
        tab: (isActive: boolean) =>
          `px-4 py-2 text-sm font-medium rounded-md
          ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`,
      },
      underline: {
        container: 'border-b border-gray-700',
        tab: (isActive: boolean) =>
          `px-4 py-2 text-sm font-medium border-b-2
          ${
            isActive
              ? 'border-blue-600 text-white'
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
          }`,
      },
    };
  
    return (
      <div className={variants[variant].container}>
        <nav className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                ${variants[variant].tab(activeTab === tab.id)}
                transition-colors duration-200
                flex items-center
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  }