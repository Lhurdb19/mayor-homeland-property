import { useEffect, useState } from "react";
import axios from "axios";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const res = await axios.get("/api/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, []);

  return { user, loading, refetch };
}
