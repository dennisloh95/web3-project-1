import React, { useEffect, useState } from "react";

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render
  if (!hasMounted) return null;

  //   prevent hydration error
  return <>{children}</>;
};

export default ClientOnly;
