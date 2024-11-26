export const setAuthToken = (token) => {
  localStorage.setItem("auth_token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
};

export const getUserRole = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};
