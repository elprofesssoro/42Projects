import { useCallback } from "react";
import { api, ApiError } from "../../api/api";
import { useNavigate } from "react-router-dom";

export function useApi() {
  const navigate = useNavigate();

  return useCallback(
    async (path, options = {}) => {
      const {
        noRedirect = false,
        noRedirectOn429 = false,
        ...apiOptions
      } = options || {};

      try {
        return await api(path, apiOptions);
      } catch (err) {
        const isApi = err instanceof ApiError;
        const status = isApi ? err.status : 0;

		if (status === 401) {
			if (err?.message.includes("Session expired")) {
				window.location.reload();
				return null;
			}
		}
        const shouldRedirect =
          !noRedirect &&
          (!isApi ||
            status === 0 ||
            status >= 500 ||
            (status === 429 && !noRedirectOn429));

        if (shouldRedirect) {
          navigate("/error", {
            state: {
              status: isApi ? status : 500,
              message: err?.message || "Unexpected error",
            },
          });
          return null;
        }

        throw err;
      }
    },
    [navigate]
  );
}
