// components/funs/ClientOnlyPortal.jsx
import { useEffect, useState } from 'react';

export default function ClientOnlyPortal({ children }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? <>{children}</> : null;
}