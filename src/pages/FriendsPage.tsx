import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserSearchBar from '../components/UserSearchBar';
import UserSearchResult from '../components/UserSearchResult';
import UserSearchDropdown from '../components/UserSearchDropdown';
import FriendRequestList from '../components/FriendRequestList';
import SentFriendRequestList from '../components/SentFriendRequestList';
import FriendsList from '../components/FriendsList';
import FriendSuggestions from '../components/FriendSuggestions';
import { useToast } from '../components/Toast/ToastProvider';
import authService from '../services/authService';
import friendService, { UserSearchResult as UserSearchResultType, FriendRequest, FriendSuggestion } from '../services/friendService';
import { friendRequestEvents, FRIEND_REQUEST_UPDATED } from '../utils/events';

interface Friend {
  id: number;
  username: string;
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToast } = useToast();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'addFriends'>('friends');
  const [searchResults, setSearchResults] = useState<UserSearchResultType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResultType | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsLimit, setSuggestionsLimit] = useState(5);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadFriendRequests();
    loadSentRequests();
    loadFriends();
    loadFriendSuggestions(5);
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

  const loadSentRequests = async () => {
    const user = authService.getUser();
    if (!user) return;
    
    try {
      const requests = await friendService.getSentRequests(user.id);
      setSentRequests(requests);
    } catch (err) {
      console.error('Failed to load sent requests:', err);
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

  const loadFriendSuggestions = async (limit: number = 5) => {
    const user = authService.getUser();
    if (!user) return;
    
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await friendService.getFriendSuggestions(user.id, limit);
      setFriendSuggestions(suggestions);
    } catch (err) {
      console.error('Failed to load friend suggestions:', err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSearch = async (searchUsername: string) => {
    const user = authService.getUser();
    if (!user) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setSelectedUser(null);

    try {
      const foundUsers = await friendService.searchUser(searchUsername);
      
      // Get friend IDs for filtering
      const friendIds = friends.map(f => f.id);
      
      // Filter out self and existing friends from results
      const filteredUsers = foundUsers.filter(u => 
        u.username !== user.username && !friendIds.includes(u.id)
      );
      
      if (filteredUsers.length === 0) {
        setSearchError('Geen gebruikers gevonden');
        return;
      }
      
      setSearchResults(filteredUsers);
    } catch (err: any) {
      setSearchError(err.message || 'Geen gebruikers gevonden');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: UserSearchResultType) => {
    setSelectedUser(user);
    setSearchResults([]);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim().length === 0) {
      setSearchError(null);
      setSearchResults([]);
    }
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

    try {
      await friendService.sendFriendRequest(user.id, receiverUsername);
      addToast('Vriendschapsverzoek succesvol verzonden!', 'success');
      setSelectedUser(null);
      // Reload sent requests and suggestions
      await loadSentRequests();
      await loadFriendSuggestions(suggestionsLimit);
    } catch (err: any) {
      const errorMessage = err.message || 'Kon vriendschapsverzoek niet verzenden';
      
      // Check if it's a pending request error
      if (errorMessage.includes('pending') || errorMessage.includes('already')) {
        addToast('Je hebt al een pending vriendschapsverzoek met deze gebruiker', 'warning');
      } else {
        addToast(errorMessage, 'error');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRespondToRequest = async (requestId: number, accepted: boolean) => {
    setIsResponding(true);

    try {
      await friendService.respondToRequest(requestId, accepted);
      addToast(
        accepted ? 'Vriendschapsverzoek geaccepteerd!' : 'Vriendschapsverzoek geweigerd',
        accepted ? 'success' : 'info'
      );
      await loadFriendRequests();
      // Reload friends list and suggestions if accepted
      if (accepted) {
        await loadFriends();
        await loadFriendSuggestions(suggestionsLimit);
      }
      // Notify navbar to update badge count
      friendRequestEvents.emit(FRIEND_REQUEST_UPDATED);
    } catch (err: any) {
      addToast(err.message || t('friends.errors.respondToRequest'), 'error');
    } finally {
      setIsResponding(false);
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    const user = authService.getUser();
    if (!user) return;

    setIsCancelling(true);
    try {
      await friendService.cancelFriendRequest(requestId, user.id);
      await loadSentRequests();
      addToast('Vriendschapsverzoek geannuleerd', 'info');
    } catch (err: any) {
      addToast(err.message || 'Kon vriendschapsverzoek niet annuleren', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('friends.title')}</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('friends')}
              className={`${
                activeTab === 'friends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab('addFriends')}
              className={`${
                activeTab === 'addFriends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Add Friends
              {(friendRequests.length > 0 || sentRequests.length > 0) && (
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-medium">
                  {friendRequests.length + sentRequests.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Friends Tab Content */}
        {activeTab === 'friends' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('friends.myFriends')}</h2>
            <FriendsList friends={friends} isLoading={isLoadingFriends} />
            
            {/* Friend Suggestions Section */}
            {friends.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Friends</h2>
                <FriendSuggestions
                  suggestions={friendSuggestions}
                  onSendRequest={handleSendRequest}
                  isSending={isSending}
                  isLoading={isLoadingSuggestions}
                  onLoadMore={() => {
                    const newLimit = suggestionsLimit + 5;
                    setSuggestionsLimit(newLimit);
                    loadFriendSuggestions(newLimit);
                  }}
                  hasMore={friendSuggestions.length >= suggestionsLimit}
                />
              </div>
            )}
          </div>
        )}

        {/* Add Friends Tab Content */}
        {activeTab === 'addFriends' && (
          <div>
            {/* Search Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('friends.searchUsers')}</h2>
              <div ref={searchContainerRef} className="relative">
                <UserSearchBar 
                  onSearch={handleSearch} 
                  onSearchTermChange={handleSearchTermChange}
                  isLoading={isSearching} 
                />
                <UserSearchDropdown 
                  users={searchResults} 
                  onSelectUser={handleSelectUser}
                  searchError={searchTerm.trim().length >= 2 ? searchError : null}
                />
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
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {t('friends.requests.title')} ({friendRequests.length})
              </h2>
              <div className="max-h-[40vh] overflow-y-auto">
                <FriendRequestList
                  requests={friendRequests}
                  onRespond={handleRespondToRequest}
                  isResponding={isResponding}
                />
              </div>
            </div>

            {/* Sent Requests Section */}
            {sentRequests.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Pending Requests ({sentRequests.length})
                </h2>
                <div className="max-h-[40vh] overflow-y-auto">
                  <SentFriendRequestList
                    requests={sentRequests}
                    onCancel={handleCancelRequest}
                    isCancelling={isCancelling}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
