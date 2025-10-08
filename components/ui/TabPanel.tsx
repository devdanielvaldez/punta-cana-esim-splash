import { ReactNode } from 'react';

interface TabPanelProps {
  children: ReactNode;
  activeTab: string;
  tabId: string;
}

export default function TabPanel({
  children,
  activeTab,
  tabId,
}: TabPanelProps) {
  if (activeTab !== tabId) {
    return null;
  }
  
  return <div>{children}</div>;
}