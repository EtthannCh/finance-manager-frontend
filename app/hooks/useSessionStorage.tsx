"use client";

import { useEffect, useState } from "react";
import { Receipt } from "../inventory/receipt/columns";

const useSessionStorage = (sessionKey: string) => {
  const [value, setValue] = useState<Receipt[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionData: Receipt[] = JSON.parse(
        `${sessionStorage.getItem(sessionKey)}`,
      );
      setValue(sessionData == null ? [] : sessionData);
    }
  }, []);

  return value;
};

export default useSessionStorage;
