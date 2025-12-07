import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    let headers: HeadersInit = {
      ...authService.getAuthHeader(),
    };
    let body: BodyInit | null = null;

    if (data instanceof FormData) {
      // Browser will automatically set Content-Type header for FormData
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return response text if not JSON, otherwise parse JSON.
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    // For responses with no content or non-JSON content, return undefined or a default value
    return {} as T; // Return an empty object if no JSON is expected
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    let headers: HeadersInit = {
      ...authService.getAuthHeader(),
    };
    let body: BodyInit | null = null;

    if (data instanceof FormData) {
      // Browser will automatically set Content-Type header for FormData
      body = data;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    // Return empty object for void responses
    return {} as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  }
}

export default new ApiService();
