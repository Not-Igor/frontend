const API_URL = process.env.REACT_APP_API_URL;

export interface UserSearchResult {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface FriendRequest {
  requestId: number;
  senderUsername: string;
}

const friendService = {
  searchUser: async (username: string): Promise<UserSearchResult[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/search?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No users found');
      }
      throw new Error('Failed to search users');
    }

    return response.json();
  },

  sendFriendRequest: async (senderId: number, receiverUsername: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverUsername,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to send friend request');
    }
  },

  getReceivedRequests: async (userId: number): Promise<FriendRequest[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/received/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friend requests');
    }

    return response.json();
  },

  respondToRequest: async (requestId: number, accepted: boolean): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        accepted,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to respond to friend request');
    }
  },

  getFriends: async (userId: number): Promise<any[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/friends/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friends');
    }

    return response.json();
  },

  getSentRequests: async (userId: number): Promise<FriendRequest[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/sent/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sent requests');
    }

    return response.json();
  },

  cancelFriendRequest: async (requestId: number, userId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/cancel/${requestId}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to cancel friend request');
    }
  },
};

export default friendService;
