import { Avatar } from '@mui/material';

interface UserAvatarProps {
  user: { name: string; avatarUrl?: string };
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserAvatar({ user, size = 32 }: UserAvatarProps) {
  return (
    <Avatar
      src={user.avatarUrl}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        fontWeight: 600,
        bgcolor: 'primary.main',
      }}
    >
      {!user.avatarUrl && getInitials(user.name)}
    </Avatar>
  );
}
