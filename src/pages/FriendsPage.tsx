import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserSearchBar from '../components/UserSearchBar';
import UserSearchResult from '../components/UserSearchResult';
import FriendRequestList from '../components/FriendRequestList';
import friendService, { UserSearchResult as UserSearchResultType, FriendRequest } from '../services/friendService';

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<UserSearchResultType | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    loadFriendRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, navigate]);

  const loadFriendRequests = async () => {
    if (!userId) return;
    
    try {
      const requests = await friendService.getReceivedRequests(parseInt(userId));
      setFriendRequests(requests);
    } catch (err) {
      console.error('Failed to load friend requests:', err);
    }
  };

  const handleSearch = async (searchUsername: string) => {
    setIsSearching(true);
    setError(null);
    setSuccessMessage(null);
    setSearchResult(null);

    try {
      const user = await friendService.searchUser(searchUsername);
      
      // Check if searching for self
      if (user.username === username) {
        setError('Je kunt geen vriendschapsverzoek naar jezelf sturen');
        return;
      }
      
      setSearchResult(user);
    } catch (err: any) {
      setError(err.message || 'Gebruiker niet gevonden');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (receiverUsername: string) => {
    if (!userId) return;

    setIsSending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await friendService.sendFriendRequest(parseInt(userId), receiverUsername);
      setSuccessMessage('Vriendschapsverzoek succesvol verzonden!');
      setSearchResult(null);
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
    } catch (err: any) {
      setError(err.message || 'Kon niet reageren op vriendschapsverzoek');
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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

        {/* Search Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Zoek gebruikers</h2>
          <UserSearchBar onSearch={handleSearch} isLoading={isSearching} />
          
          {searchResult && (
            <UserSearchResult
              user={searchResult}
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
