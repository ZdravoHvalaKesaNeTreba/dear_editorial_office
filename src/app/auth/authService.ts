/**
 * Сервис для работы с Яндекс OAuth 2.0
 */

export interface YandexUser {
  id: string;
  login: string;
  display_name: string;
  default_avatar_id?: string;
  emails?: string[];
  real_name?: string;
}

export interface AuthTokens {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const YANDEX_OAUTH_URL = 'https://oauth.yandex.ru/authorize';
const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';
const YANDEX_USER_INFO_URL = 'https://login.yandex.ru/info';

// Storage keys
const ACCESS_TOKEN_KEY = 'yandex_access_token';
const USER_INFO_KEY = 'yandex_user_info';
const TOKEN_EXPIRY_KEY = 'yandex_token_expiry';

class AuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_YANDEX_CLIENT_ID || '';
    this.redirectUri = import.meta.env.VITE_YANDEX_REDIRECT_URI || 
      `${window.location.origin}/auth/callback`;

    if (!this.clientId) {
      console.warn('VITE_YANDEX_CLIENT_ID не установлен. Авторизация будет недоступна.');
    }
  }

  /**
   * Генерирует URL для авторизации через Яндекс
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      // Запрашиваем доступ к базовой информации
      scope: 'login:info login:email login:avatar',
      // State для защиты от CSRF
      state: this.generateState(),
    });

    return `${YANDEX_OAUTH_URL}?${params.toString()}`;
  }

  /**
   * Генерирует случайную строку для state (защита от CSRF)
   */
  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);
    return state;
  }

  /**
   * Проверяет state из callback
   */
  validateState(state: string): boolean {
    const savedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return state === savedState;
  }

  /**
   * Начинает процесс авторизации
   */
  login(): void {
    window.location.href = this.getAuthUrl();
  }

  /**
   * Обменивает authorization code на access token
   * ВАЖНО: Это должно делаться на бэкенде!
   * Здесь упрощенная версия для демонстрации
   */
  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    // В реальном приложении этот запрос должен идти на ВАШ бэкенд,
    // который затем обращается к Яндекс OAuth API с client_secret
    
    // Пример запроса к вашему бэкенду:
    const response = await fetch('/api/auth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Не удалось обменять код на токен');
    }

    const tokens: AuthTokens = await response.json();
    this.saveTokens(tokens);
    return tokens;
  }

  /**
   * Сохраняет токены в localStorage
   */
  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    
    // Вычисляем время истечения токена
    const expiryTime = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Получает сохраненный access token
   */
  getAccessToken(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    // Проверяем, не истек ли токен
    if (Date.now() > parseInt(expiry, 10)) {
      this.logout();
      return null;
    }

    return token;
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Получает информацию о пользователе
   */
  async getUserInfo(): Promise<YandexUser | null> {
    // Сначала проверяем кэш
    const cachedUser = localStorage.getItem(USER_INFO_KEY);
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя:', e);
      }
    }

    // Если нет в кэше, запрашиваем у API
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(YANDEX_USER_INFO_URL, {
        headers: {
          'Authorization': `OAuth ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить информацию о пользователе');
      }

      const user: YandexUser = await response.json();
      
      // Кэшируем информацию
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      return null;
    }
  }

  /**
   * Выход из системы
   */
  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /**
   * Получает URL аватара пользователя
   */
  getAvatarUrl(avatarId: string, size: 'islands-small' | 'islands-middle' | 'islands-retina-small' | 'islands-retina-middle' = 'islands-middle'): string {
    return `https://avatars.yandex.net/get-yapic/${avatarId}/${size}`;
  }
}

// Экспортируем синглтон
export const authService = new AuthService();
