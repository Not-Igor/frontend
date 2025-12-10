import React from 'react';

interface UserInfoCardProps {
  avatarUrl: string;
  username: string;
  role: string;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ avatarUrl, username, role }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={avatarUrl}
        alt={`${username} avatar`}
        className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
      />
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {username}
      </h2>
      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full mb-6">
        {role}
      </span>
    </div>
  );
};

export default UserInfoCard;
