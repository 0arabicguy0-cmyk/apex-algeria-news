import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname + location.search);

  useEffect(() => {
    setKey(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div key={key} className="animate-fade-in">
      {children}
    </div>
  );
}
