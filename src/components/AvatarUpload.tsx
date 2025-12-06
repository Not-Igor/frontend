import React from 'react';

interface AvatarUploadButtonProps {
    onUploadSuccess: (url: string) => void;
    children: React.ReactNode;
}

const AvatarUploadButton: React.FC<AvatarUploadButtonProps> = ({ onUploadSuccess, children }) => {
    
    const showWidget = () => {
        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
          {
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
            cropping: true,
            croppingAspectRatio: 1,
            showAdvancedOptions: false,
            sources: ['local', 'url', 'camera'],
            styles: {
              palette: {
                window: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                menuIcons: '#5A616A',
                textDark: '#000000',
                textLight: '#FFFFFF',
                link: '#0078FF',
                action: '#FF620C',
                inactiveTabIcon: '#B3B3B3',
                error: '#F44235',
                inProgress: '#0078FF',
                complete: '#20B832',
                sourceBg: '#E4EBF1'
              }
            }
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              onUploadSuccess(result.info.secure_url);
            }
          }
        );
        widget.open();
      };

    return (
        <div onClick={showWidget} className="cursor-pointer">
            {children}
        </div>
    );
};


export default AvatarUploadButton;
