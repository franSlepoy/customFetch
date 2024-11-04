import { useEffect, useState } from "react";

const useHttpData = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function hook() {
      try {
        setLoading(true);

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`${response.status}`);
        const data: T[] = await response.json();
        setData(data);
        setError(undefined);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    hook();

    return () => {
      controller.abort(); // Esto aborta la solicitud cuando el componente se desmonta
    };
  }, []);

  return { data, loading, error };
};

export default useHttpData;
