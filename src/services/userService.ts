import apiService from './apiService';

export interface UserUpdateDto {
  newUsername?: string;
  currentPassword?: string;
  newPassword?: string;
}

class UserService {
  async updateUserProfile(dto: UserUpdateDto): Promise<void> {
    await apiService.put('/users/profile', dto);
  }
}

export default new UserService();
