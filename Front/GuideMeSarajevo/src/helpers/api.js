import axios from "axios";

const api = axios.create({
  baseURL: "https://guidemesarajevo.onrender.com/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

export const fetchLocationsByCategory = async (categoryId) => {
  const res = await api.get(`/api/locations/category/${categoryId}`);
  return res.data;
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${api}${url}`, {
      ...options,
      headers: defaultHeaders,
    });

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${api}/api/auth/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email: localStorage.getItem("email") }),
        });

        if (!refreshResponse.ok) {
          throw new Error(`Token refresh failed: ${refreshResponse.statusText}`);
        }

        const { token: newToken } = await refreshResponse.json();
        localStorage.setItem("token", newToken);

        const retryResponse = await fetch(`${api}${url}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          const contentType = retryResponse.headers.get("content-type");
          let errorMessage = `Request failed: ${retryResponse.statusText}`;
          try {
            if (contentType && contentType.includes("application/json")) {
              const errorData = await retryResponse.json();
              errorMessage = errorData.message || JSON.stringify(errorData);
            } else {
              errorMessage = await retryResponse.text();
            }
          } catch (parseError) {
            errorMessage = `Request failed: ${retryResponse.statusText} (Response parsing failed: ${parseError.message})`;
          }
          throw new Error(errorMessage);
        }

        const contentType = retryResponse.headers.get("content-type");
        return contentType && contentType.includes("application/json")
          ? await retryResponse.json()
          : await retryResponse.text();
      } catch (err) {
        console.error("Error refreshing token:", err.message);
        throw err;
      }
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Request failed: ${response.statusText}`;
      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await response.text();
        }
      } catch (parseError) {
        errorMessage = `Request failed: ${response.statusText} (Response parsing failed: ${parseError.message})`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err.message);
    throw err;
  }
};

export default api;
