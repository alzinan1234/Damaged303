export const API_BASE_URL = "https://maintains-usb-bell-with.trycloudflare.com";

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};