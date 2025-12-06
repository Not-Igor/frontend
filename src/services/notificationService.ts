import apiService from './apiService';

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MATCH_CREATED = 'MATCH_CREATED',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  USER_LEFT_COMPETITION = 'USER_LEFT_COMPETITION'
}

export interface NotificationDto {
  id: number;
  type: NotificationType;
  message: string;
  relatedId: number | null;
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  async getNotifications(): Promise<NotificationDto[]> {
    return await apiService.get<NotificationDto[]>('/notifications');
  }

  async getUnreadNotifications(): Promise<NotificationDto[]> {
    return await apiService.get<NotificationDto[]>('/notifications/unread');
  }

  async getUnreadCount(): Promise<number> {
    return await apiService.get<number>('/notifications/unread/count');
  }

  async markAsRead(id: number): Promise<void> {
    return await apiService.post(`/notifications/${id}/read`, {});
  }

  async markAllAsRead(): Promise<void> {
    return await apiService.post('/notifications/read-all', {});
  }
}

export default new NotificationService();
