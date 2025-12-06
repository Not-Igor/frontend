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
}

export default new UserService();
