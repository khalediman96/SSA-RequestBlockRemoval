import { useCallback, useState } from "react";

export function useCharCount(max: number, initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = useCallback(
    (next: string) => {
      setValue(next.slice(0, max));
    },
    [max],
  );

  return { value, setValue, onChange, count: value.length, max };
}