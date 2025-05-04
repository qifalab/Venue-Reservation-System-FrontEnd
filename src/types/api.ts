// 用户基础信息
export interface User {
  id: number;
  name: string;
  stu_id: number;
  password?: string;
  email: string;
}

// 预约相关接口类型
export interface Venue {
  id: number;
  name: string;
  availableDate: string;
}

export interface TimeSlot {
  id?: number;
  startTime?: string;
  endTime?: string;
  available?: boolean;
  status?: number;
}

export interface Partner {
  id: number;
  name: string;
  introduction: string;
  venueIds: string;
  phoneNumber: string;
  isAvailable: boolean;
}

export interface Reservation {
  id: number;
  date: string;
  venueId: number;
  timeSlot: string;
  needPartner: boolean;
  partnerId?: number;
  userName: string;
  studentId: string;
  phoneNumber: string;
  remarks?: string;
  createTime: string;
  status: string;
}

// 管理后台场馆信息
export interface AdminVenue {
  id: number;
  name: string;
  type: string;
  capacity: number;
  description: string;
  isActive: boolean;
}

// 管理后台预约信息
export interface AdminReservation extends Reservation {
  userName: string;
  venueName: string;
  partnerName?: string;
  createTime: string;
}

// 场地使用率
export interface VenueUsage {
  venueName: string;
  usageRate: number;
}

// 预约趋势数据
export interface TrendData {
  date: string;
  count: number;
}

// 仪表盘统计数据
export interface DashboardStats {
  totalUsers: number;
  todayReservations: number;
  totalVenues: number;
  totalHours: number;
}

// 分页参数
export interface PageParams {
  page: number;
  size: number;
  sort?: string;
  order?: string;
  search?: string;
}

// 分页响应
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

// 管理后台用户
export interface AdminUser extends User {
  role: string;
  status: string;
  createTime: string;
  lastLoginTime: string;
}

// 管理后台陪练
export interface AdminPartner extends Partner {
  avatar?: string;
  phone?: string;
  email?: string;
  status: string;
  createTime: string;
  updateTime: string;
}

// 公告
export interface Announcement {
  id: number;
  title: string;
  content: string;
  status: string;
  createTime: string;
  updateTime: string;
}

// 后台订单信息
export interface AdminOrder {
  id: number;
  userId: number;
  userName: string;
  venueId: number;
  venueName: string;
  partnerId?: number;
  partnerName?: string;
  date: string;
  timeSlot: string;
  status: string;
  price: number;
  userInfo: {
    name: string;
    phone: string;
    remark?: string;
  };
  createTime: string;
  updateTime: string;
} 