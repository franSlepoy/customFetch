import { useEffect, useState } from "react";

type ID = {
  id?: string | number;
};

const useFetchData = <T extends Id>(url: string) => {
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
        const fetchedData: T[] = await response.json();
        setData(fetchedData);
        setError(null);
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
  }, [url]);

  const addData = async (element: T) => {
    const initialData = [...data];
    const newData = [{ id: 0, ...element }, ...data];
    setData(newData);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(element),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setData(initialData);
        throw new Error(`${response.status}`);
      }
      const savedData = await response.json();
      setData([savedData, ...initialData]);
    } catch (error) {
      setError((error as Error).message);
      setData(initialData);
    }
  };

  const deleteData = async (id: string | number) => {
    const initialData = [...data];
    setData(data.filter((x) => x.id !== id));
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setData(initialData);
        throw new Error(`${response.status}`);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const updateData = async (updatedElement: T) => {
    const initialData = [...data];
    setData(data.map((x) => (x.id == updatedElement.id ? updatedElement : x)));
    try {
      const response = await fetch(`${url}/${updatedElement.id}`, {
        method: "PUT",
      });
      if (!response.ok) {
        setData(initialData);
        throw new Error(`${response.status}`);
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return { data, loading, error, addData, deleteData, updateData };
};

export default useFetchData;
