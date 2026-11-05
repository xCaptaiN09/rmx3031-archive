import { useState, useEffect, createContext, useContext } from "react";
import type { CategoryKey } from "../lib/archive";

export interface Entry {
  name: string;
  version?: string;
  android?: string;
  date: string;
  size?: string;
  url: string;
  changelog: string;
}

export type SiteData = {
  device: string;
  codename: string;
  maintainer: string;
} & Partial<Record<CategoryKey, Entry[]>>;

interface DataContextType {
  data: SiteData | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
  error: null,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/index.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
