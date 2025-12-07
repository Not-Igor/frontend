import React, { useRef, ChangeEvent } from 'react';
import userService from '../services/userService'; // Import userService

interface AvatarUploadButtonProps {
    onUploadSuccess: (url: string) => void;
    children: React.ReactNode;
}

const AvatarUploadButton: React.FC<AvatarUploadButtonProps> = ({ onUploadSuccess, children }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                const imageUrl = await userService.updateAvatar(file);
                onUploadSuccess(imageUrl);
            } catch (error) {
                console.error("Error uploading avatar:", error);
                // Optionally show an error message to the user
            }
        }
    };

    const handleChildrenClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div onClick={handleChildrenClick} className="cursor-pointer">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {children}
        </div>
    );
};

export default AvatarUploadButton;
