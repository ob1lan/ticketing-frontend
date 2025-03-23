const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object} [body] - Request body (optional)
 * @param {Object} [customHeaders] - Additional headers (optional)
 * @param {boolean} [requireAuth] - Whether authentication is required (default: true)
 * @returns {Promise<any>} - API response JSON
 */
const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  customHeaders = {},
  requireAuth = true
) => {
  try {
    const headers = requireAuth
      ? { ...getAuthHeaders(), ...customHeaders }
      : { "Content-Type": "application/json", ...customHeaders };

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "API request failed");
    }

    return res.status === 204 ? null : await res.json();
  } catch (err) {
    console.error(`Error in API request to ${endpoint}:`, err);
    throw err;
  }
};

// API Functions using `apiRequest`

export const fetchProfile = () => apiRequest("/accounts/profile/");
export const updateProfile = (profileData) =>
  apiRequest("/accounts/profile/", "PATCH", profileData);
export const fetchTickets = (
  pageOrUrl = 1,
  status = "",
  query = "",
  includeClosed = true
) => {
  let endpoint =
    typeof pageOrUrl === "string" ? pageOrUrl : `/tickets/?page=${pageOrUrl}`;

  if (status) {
    endpoint += `&status=${status}`;
  } else if (!includeClosed) {
    endpoint += `&status=open&status=pending&status=in_progress&status=resolved`;
  }

  if (query) endpoint += `&search=${query}`;

  return apiRequest(endpoint);
};

export const fetchCompanies = () => apiRequest("/companies/");
export const createTicket = (ticketData) =>
  apiRequest("/tickets/", "POST", ticketData);
export const changePassword = (currentPassword, newPassword) =>
  apiRequest("/auth/users/set_password/", "POST", {
    current_password: currentPassword,
    new_password: newPassword,
  });
export const loginUser = async (email, password) => {
  return apiRequest("/auth/jwt/create/", "POST", { email, password }, false);
};
export const fetchTicketComments = (ticketId) =>
  apiRequest(`/tickets/${ticketId}/comments/`);
export const postTicketComment = (ticketId, message) =>
  apiRequest(`/tickets/${ticketId}/comments/`, "POST", { message });
export const fetchTicketTimeEntries = (ticketId) =>
  apiRequest(`/tickets/${ticketId}/time-entries/`);
export const fetchAssignees = () => apiRequest("/accounts/");
export const updateTicket = (ticketId, updatedData) =>
  apiRequest(`/tickets/${ticketId}/`, "PATCH", updatedData);
export const fetchTicketById = (ticketId) =>
  apiRequest(`/tickets/${ticketId}/`);
export const fetchTicketHistory = (ticketId) =>
  apiRequest(`/tickets/${ticketId}/history/`);
