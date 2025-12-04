import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSearchBar from '../components/UserSearchBar';
import UserSearchResult from '../components/UserSearchResult';
import UserSearchDropdown from '../components/UserSearchDropdown';
import FriendRequestList from '../components/FriendRequestList';
import FriendsList from '../components/FriendsList';
import authService from '../services/authService';
import friendService, { UserSearchResult as UserSearchResultType, FriendRequest } from '../services/friendService';
import { friendRequestEvents, FRIEND_REQUEST_UPDATED } from '../utils/events';

interface Friend {
  id: number;
  username: string;
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<UserSearchResultType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResultType | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadFriendRequests();
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadFriendRequests = async () => {
    const user = authService.getUser();
    if (!user) return;
    
    try {
      const requests = await friendService.getReceivedRequests(user.id);
      setFriendRequests(requests);
    } catch (err) {
      console.error('Failed to load friend requests:', err);
    }
  };

  const loadFriends = async () => {
    const user = authService.getUser();
    if (!user) return;
    
    setIsLoadingFriends(true);
    try {
      const friendsList = await friendService.getFriends(user.id);
      setFriends(friendsList);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSearch = async (searchUsername: string) => {
    const user = authService.getUser();
    if (!user) return;

    setIsSearching(true);
    setError(null);
    setSuccessMessage(null);
    setSearchResults([]);
    setSelectedUser(null);

    try {
      const foundUsers = await friendService.searchUser(searchUsername);
      
      // Filter out self from results
      const filteredUsers = foundUsers.filter(u => u.username !== user.username);
      
      if (filteredUsers.length === 0) {
        setError('Geen gebruikers gevonden');
        return;
      }
      
      setSearchResults(filteredUsers);
    } catch (err: any) {
      setError(err.message || 'Geen gebruikers gevonden');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: UserSearchResultType) => {
    setSelectedUser(user);
    setSearchResults([]);
  };

  // Close dropdown when clicking outside - just like MovieSearchBar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendRequest = async (receiverUsername: string) => {
    const user = authService.getUser();
    if (!user) return;

    setIsSending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await friendService.sendFriendRequest(user.id, receiverUsername);
      setSuccessMessage('Vriendschapsverzoek succesvol verzonden!');
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message || 'Kon vriendschapsverzoek niet verzenden');
    } finally {
      setIsSending(false);
    }
  };

  const handleRespondToRequest = async (requestId: number, accepted: boolean) => {
    setIsResponding(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await friendService.respondToRequest(requestId, accepted);
      setSuccessMessage(accepted ? 'Vriendschapsverzoek geaccepteerd!' : 'Vriendschapsverzoek geweigerd');
      await loadFriendRequests();
      // Reload friends list if accepted
      if (accepted) {
        await loadFriends();
      }
      // Notify navbar to update badge count
      friendRequestEvents.emit(FRIEND_REQUEST_UPDATED);
    } catch (err: any) {
      setError(err.message || 'Kon niet reageren op vriendschapsverzoek');
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Vrienden</h1>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Friends List Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mijn vrienden</h2>
          <FriendsList friends={friends} isLoading={isLoadingFriends} />
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Zoek gebruikers</h2>
          <div ref={searchContainerRef} className="relative">
            <UserSearchBar onSearch={handleSearch} isLoading={isSearching} />
            <UserSearchDropdown users={searchResults} onSelectUser={handleSelectUser} />
          </div>
          
          {selectedUser && (
            <UserSearchResult
              user={selectedUser}
              onSendRequest={handleSendRequest}
              isSending={isSending}
            />
          )}
        </div>

        {/* Friend Requests Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Vriendschapsverzoeken ({friendRequests.length})
          </h2>
          <FriendRequestList
            requests={friendRequests}
            onRespond={handleRespondToRequest}
            isResponding={isResponding}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
