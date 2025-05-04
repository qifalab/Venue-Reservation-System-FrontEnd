import axios from 'axios'
import { API_BASE_URL, API_ROUTES } from './config'
import type { Reservation } from '@/types/api'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 用户相关接口
export const userService = {
  // 用户登录
  login(data: { stu_id: number; password: string }) {
    return apiClient.post(API_ROUTES.USER_LOGIN, data)
  },

  // 用户注册
  register(data: { 
    name: string;
    stu_id: number;
    password: string;
    email: string;
  }) {
    return apiClient.post(API_ROUTES.USER_REGISTER, data)
  },
}

// 预约相关接口
export const reservationService = {
  // 获取可预约日期
  getAvailableDates() {
    return apiClient.get('/api/venues/available-dates')
  },

  // 获取可用场馆
  getAvailableVenues(date: string) {
    return apiClient.get('/api/venues', {
      params: { date }
    })
  },

  // 获取时间段状态
  getTimeSlots(date: string, venueId: number) {
    return apiClient.get(`/api/venues/${venueId}/time-slots`, {
      params: { date }
    })
  },

  // 获取可用陪练
  getAvailablePartners(venueId: number) {
    return apiClient.get(`/api/reservations/venues/${venueId}/partners`)
  },

  // 提交预约
  submitReservation(data: Reservation) {
    return apiClient.post('/api/reservations', data)
  },
} 