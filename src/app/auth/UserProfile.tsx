import { type YandexUser, authService } from './authService';

interface UserProfileProps {
  user: YandexUser;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const avatarUrl = user.default_avatar_id
    ? authService.getAvatarUrl(user.default_avatar_id, 'islands-middle')
    : null;

  const displayName = user.real_name || user.display_name || user.login;

  return (
    <div className="flex items-center gap-3">
      {/* Аватар */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Информация о пользователе */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {displayName}
        </span>
        {user.login && user.login !== displayName && (
          <span className="text-xs text-gray-500">
            @{user.login}
          </span>
        )}
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={onLogout}
        className="ml-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
        aria-label="Выйти"
      >
        Выйти
      </button>
    </div>
  );
}
