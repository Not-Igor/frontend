import React from 'react';

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
}

const EMOJIS = [
  '⚽', '🏀', '🎾', '🏐', '🏈', '⚾', 
  '🏓', '🏸', '🥊', '🎯', '🎮', '🏆',
  '🥇', '🥈', '🥉', '🎖️', '🏅', '🎪',
  '🎨', '🎭', '🎬', '🎵', '🎸', '🎲',
  '🍕', '🍔', '🍟', '🍺', '☕', '🍰',
  '🚀', '⭐', '🔥', '💎', '👑', '⚡'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onSelectEmoji }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Competition Icon
      </label>
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelectEmoji(emoji)}
            className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
              selectedEmoji === emoji
                ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
