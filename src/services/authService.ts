const API_URL = process.env.REACT_APP_API_URL;

export interface AuthenticationResponse {
  message: string;
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

class AuthService {
  async login(username: string, password: string): Promise<AuthenticationResponse> {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login mislukt');
    }

    const data: AuthenticationResponse = await response.json();
    
    if (data.token) {
      this.setToken(data.token);
      this.setUser(data);
    }

    return data;
  }

  async register(username: string, password: string, email: string): Promise<any> {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registratie mislukt');
    }

    return await response.json();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: AuthenticationResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): AuthenticationResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();
