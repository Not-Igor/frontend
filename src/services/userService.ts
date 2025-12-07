import apiService from './apiService';
import { AuthenticationResponse } from './authService';

export interface UserUpdateDto {
  newUsername?: string;
  currentPassword?: string;
  newPassword?: string;
}

class UserService {
  async updateUserProfile(dto: UserUpdateDto): Promise<AuthenticationResponse> {
    return await apiService.put('/users/profile', dto);
  }

  async updateAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return await apiService.post('/users/profile/avatar', formData);
  }
}

export default new UserService();
