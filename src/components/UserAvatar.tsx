import { useState } from 'react';
import type { User } from 'firebase/auth';

interface UserAvatarProps {
  user: User;
  size?: 'lg';
  className?: string;
  style?: React.CSSProperties;
}

function initialsFor(user: User): string {
  const source = user.displayName || user.email || '?';
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function UserAvatar({ user, size, className = '', style }: UserAvatarProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const classes = `app-avatar${size === 'lg' ? ' app-avatar-lg' : ''}${className ? ` ${className}` : ''}`;

  if (user.photoURL && !photoFailed) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || user.email || 'Profile photo'}
        referrerPolicy="no-referrer"
        onError={() => setPhotoFailed(true)}
        className={classes}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <div className={classes} style={style}>
      {initialsFor(user)}
    </div>
  );
}
