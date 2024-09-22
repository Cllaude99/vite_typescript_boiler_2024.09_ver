import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
export const REFRESH_URL = BACKEND_URL + '/api/auth/refresh';

export const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

const getNewToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.get(REFRESH_URL, {
      headers: {
        'Authorization-refresh': `Bearer ${refreshToken}`,
      },
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    return { accessToken, refreshToken: newRefreshToken };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 헤더에 엑세스 토큰 담기
    const accessToken: string | null = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    //  402에러가 아니거나 재요청이거나 refresh 요청인 경우 그냥 에러 발생
    if (response.status !== 402 || config.sent || config.url === REFRESH_URL) {
      return Promise.reject(error);
    }

    // 아닌 경우 토큰 갱신
    config.sent = true; // 무한 재요청 방지
    const newToken = await getNewToken();

    if (newToken) {
      localStorage.setItem('accessToken', newToken.accessToken);
      localStorage.setItem('refreshToken', newToken.refreshToken);
      config.headers.Authorization = `Bearer ${newToken.accessToken}`;
      return instance(config); // 재요청
    }

    return Promise.reject(error);
  }
);
