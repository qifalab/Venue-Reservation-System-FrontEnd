// API基础配置
export const API_BASE_URL = 'http://localhost:8080'

// API路径配置
export const API_ROUTES = {
  // 用户相关
  USER_LOGIN: '/api/user/login',
  USER_REGISTER: '/api/user/register',
  
  // 预约相关
  GET_AVAILABLE_DATES: '/api/reservations/available-dates',
  GET_AVAILABLE_VENUES: '/api/reservations/available-venues',
  GET_TIME_SLOTS: '/api/reservations/time-slots',
  GET_AVAILABLE_PARTNERS: '/api/reservations/available-partners',
  SUBMIT_RESERVATION: '/api/reservations',
} 