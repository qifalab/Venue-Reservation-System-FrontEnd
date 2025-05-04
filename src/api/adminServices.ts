import axios from 'axios'
import { API_BASE_URL } from './config'
import type { 
  AdminVenue, 
  AdminReservation, 
  AdminUser,
  AdminPartner,
  Announcement,
  PageParams,
  PageResponse,
  AdminOrder,
  Reservation,
  Partner
} from '@/types/api'

// 创建专门的管理后台axios实例
const adminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 场馆管理接口
export const adminVenueService = {
  // 获取所有场馆
  getAllVenues() {
    return adminClient.get<AdminVenue[]>('/api/admin/venues')
  },

  // 添加场馆
  addVenue(venue: AdminVenue) {
    return adminClient.post('/api/admin/venues', venue)
  },

  // 更新场馆
  updateVenue(id: number, venue: AdminVenue) {
    return adminClient.put(`/api/admin/venues/${id}`, venue)
  },

  // 删除场馆
  deleteVenue(id: number) {
    return adminClient.delete(`/api/admin/venues/${id}`)
  }
}

// 预约管理接口
export const adminReservationService = {
  // 获取所有预约
  getAllReservations() {
    return adminClient.get<AdminReservation[]>('/api/admin/reservations')
  },

  // 更新预约状态
  updateReservationStatus(id: number, status: string) {
    return adminClient.put(`/api/admin/reservations/${id}/status`, null, {
      params: { status }
    })
  }
}

// 仪表盘数据接口
export const adminDashboardService = {
  // 获取统计数据
  getStats() {
    return adminClient.get('/api/admin/dashboard/stats')
  },

  // 取预约趋势
  getTrends() {
    return adminClient.get('/api/admin/dashboard/trends')
  },

  // 获取场地使用率
  getVenueUsage() {
    return adminClient.get('/api/admin/dashboard/venue-usage')
  }
}

// 用户管理接口
export const adminUserService = {
  // 获取用户列表
  getUsers(params: PageParams) {
    return adminClient.get<PageResponse<AdminUser>>('/api/admin/users', { params })
  },

  // 更新用户状态
  updateUserStatus(id: number, status: string) {
    return adminClient.put(`/api/admin/users/${id}/status`, { status })
  },

  // 删除用户
  deleteUser(id: number) {
    return adminClient.delete(`/api/admin/users/${id}`)
  }
}

// 陪练管理接口
export const adminPartnerService = {
  // 获取陪练列表
  getPartners(venueId: number) {
    return adminClient.get<Partner[]>(`/api/reservations/venues/${venueId}/partners`)
  },

  // 更新陪练状态
  updatePartnerStatus(id: number, isAvailable: boolean) {
    return adminClient.put(`/api/admin/partners/${id}/status`, { isAvailable })
  },

  // 添加陪练
  addPartner(partner: Partner) {
    return adminClient.post('/api/admin/partners', partner)
  },

  // 更新陪练信息
  updatePartner(id: number, partner: Partner) {
    return adminClient.put(`/api/admin/partners/${id}`, partner)
  },

  // 删除陪练
  deletePartner(id: number) {
    return adminClient.delete(`/api/admin/partners/${id}`)
  }
}

// 公告管理接口
export const adminAnnouncementService = {
  // 获取公告列表
  getAnnouncements(params: PageParams) {
    return adminClient.get<PageResponse<Announcement>>('/api/admin/announcements', { params })
  },

  // 添加公告
  addAnnouncement(announcement: Announcement) {
    return adminClient.post('/api/admin/announcements', announcement)
  },

  // 更新公告
  updateAnnouncement(id: number, announcement: Announcement) {
    return adminClient.put(`/api/admin/announcements/${id}`, announcement)
  },

  // 删除公告
  deleteAnnouncement(id: number) {
    return adminClient.delete(`/api/admin/announcements/${id}`)
  }
}

// 订单管理接口
export const adminOrderService = {
  // 获取订单列表
  getOrders(params: {
    current?: number;
    size?: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return adminClient.get<PageResponse<Reservation>>('/api/admin/orders', { params })
  },

  // 更新订单状态
  updateOrderStatus(id: number, status: string) {
    return adminClient.put(`/api/admin/orders/${id}/status`, null, {
      params: { status }
    })
  },

  // 删除订单
  deleteOrder(id: number): Promise<boolean> {
    const url = `${API_BASE_URL}/api/admin/orders/${id}`;
    console.log('开始删除订单，完整URL:', url);
    console.log('开始删除订单:', id);
    return adminClient.delete<boolean>(`/api/admin/orders/${id}`)
      .then(response => {
        console.log('删除订单响应:', response);
        // 确保返回的是布尔值
        const success = Boolean(response.data);
        console.log('删除结果:', success);
        return success;
      })
      .catch(error => {
        console.error('删除订单失败:', error);
        console.error('错误详情:', error.response?.data);
        console.error('请求URL:', url);
        throw error;
      });
  }
} 