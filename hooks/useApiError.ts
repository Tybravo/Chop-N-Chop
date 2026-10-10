import { useState, useCallback } from "react";
import { formatApiError } from "@/lib/format-error";

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = formatApiError(err);
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError, setError };
}
