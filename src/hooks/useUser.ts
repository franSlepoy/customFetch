import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
};

const useUser = () => {
  const [users, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = "https://jsonplaceholder.typicode.com/users";
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json() as Promise<User[]>;
      })
      .then((data) => setUser(data))
      .catch((error: Error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  return { users, loading, error };
};

export default useUser;
