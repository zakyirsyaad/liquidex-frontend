import { useEffect, useState } from "react";

export function useGetLiquidex() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/liquidex", {
        method: "GET",
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  return { data };
}
