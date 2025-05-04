<template>
  <div class="orders-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <div class="search-area">
            <!-- 搜索区域 -->
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名/场馆名"
              style="width: 200px"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>

            <!-- 状态筛选 -->
            <el-select v-model="statusFilter" placeholder="订单状态" clearable @change="handleSearch">
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
              <el-option label="已取消" value="cancelled" />
            </el-select>

            <!-- 日期范围选择 -->
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              @change="handleSearch"
            />
          </div>
        </div>
      </template>
      
      <el-table :data="orders" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="订单编号" width="100" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="venueName" label="场馆名称" width="120" />
        <el-table-column prop="date" label="预约日期" width="120" />
        <el-table-column prop="timeSlot" label="时间段" width="120" />
        <el-table-column prop="partnerName" label="陪练" width="120">
          <template #default="scope">
            {{ scope.row.partnerName || '无' }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="金额" width="100">
          <template #default="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button 
                size="small"
                type="success"
                :disabled="scope.row.status !== 'pending'"
                @click="handleUpdateStatus(scope.row, 'approved')"
              >
                通过
              </el-button>
              <el-button
                size="small"
                type="danger"
                :disabled="scope.row.status !== 'pending'"
                @click="handleUpdateStatus(scope.row, 'rejected')"
              >
                拒绝
              </el-button>
              <el-button
                size="small"
                type="info"
                @click="handleShowDetail(scope.row)"
              >
                详情
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="500px"
    >
      <div class="order-detail">
        <div class="detail-item">
          <span class="label">订单编号：</span>
          <span>{{ currentOrder?.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">预约用户：</span>
          <span>{{ currentOrder?.userName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">场馆名称：</span>
          <span>{{ currentOrder?.venueName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">预约日</span>
          <span>{{ currentOrder?.date }}</span>
        </div>
        <div class="detail-item">
          <span class="label">时间段：</span>
          <span>{{ currentOrder?.timeSlot }}</span>
        </div>
        <div class="detail-item">
          <span class="label">陪练：</span>
          <span>{{ currentOrder?.partnerName || '无' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单金额：</span>
          <span>¥{{ currentOrder?.price.toFixed(2) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">订单状态：</span>
          <el-tag :type="getStatusType(currentOrder?.status)">
            {{ getStatusText(currentOrder?.status) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">联系人：</span>
          <span>{{ currentOrder?.userInfo?.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">联系电话：</span>
          <span>{{ currentOrder?.userInfo?.phone }}</span>
        </div>
        <div class="detail-item">
          <span class="label">备注：</span>
          <span>{{ currentOrder?.userInfo?.remark || '无' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span>{{ currentOrder?.createTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">更新时间：</span>
          <span>{{ currentOrder?.updateTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { AdminOrder } from '@/types/api'
import { adminOrderService } from '@/api/adminServices'

const loading = ref(false)
const orders = ref<AdminOrder[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单详情相关
const detailVisible = ref(false)
const currentOrder = ref<AdminOrder | null>(null)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 状态映射
const statusMap = {
  pending: { type: 'warning', text: '待审核' },
  approved: { type: 'success', text: '已通过' },
  rejected: { type: 'danger', text: '已拒绝' },
  cancelled: { type: 'info', text: '已取消' }
}

// 获取状态样式
const getStatusType = (status?: string) => {
  return status ? statusMap[status as keyof typeof statusMap]?.type || 'info' : 'info'
}

// 获取状态文本
const getStatusText = (status?: string) => {
  return status ? statusMap[status as keyof typeof statusMap]?.text || status : ''
}

// 获取订单列表
const fetchOrders = async () => {
  try {
    loading.value = true;
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value,
      startDate: dateRange.value?.[0]?.toISOString().split('T')[0],
      endDate: dateRange.value?.[1]?.toISOString().split('T')[0]
    }
    const response = await adminOrderService.getOrders(params)
    orders.value = response.data.records.map(order => ({
      id: Number(order.id),
      userId: order.userId,
      userName: order.userName,
      venueId: order.venueId,
      venueName: order.venueName || `场馆${order.venueId}`,
      date: order.date,
      timeSlot: order.timeSlot,
      partnerName: order.partnerName || (order.partnerId ? `陪练${order.partnerId}` : '无'),
      price: order.price || 100,
      status: order.status,
      createTime: order.createTime,
      updateTime: order.updateTime,
      userInfo: {
        name: order.userName,
        phone: order.phoneNumber,
        remark: order.remarks
      }
    }))
    total.value = response.data.total
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 更新订单状态
const handleUpdateStatus = async (order: AdminOrder, status: string) => {
  try {
    const action = status === 'approved' ? '通过' : '拒绝'
    await ElMessageBox.confirm(
      `确定要${action}该订单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await adminOrderService.updateOrderStatus(order.id, status)
    ElMessage.success(`${action}成功`)
    fetchOrders()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '操作失败')
    }
  }
}

// 删除订单
const handleDelete = async (order: AdminOrder) => {
  if (!order?.id) {
    console.warn('无效的订单ID:', order);
    ElMessage.error('无效的订单ID');
    return;
  }

  // 打印实际要删除的ID，用于调试
  console.log('要删除的��单ID类型:', typeof order.id);
  console.log('要删除的订单ID值:', order.id);

  try {
    await ElMessageBox.confirm(
      '确定要删除该订单吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    console.log('开始删除订单，ID:', order.id);
    loading.value = true;
    const success = await adminOrderService.deleteOrder(order.id);
    console.log('删除操作返回结果:', success);
    
    if (success) {
      ElMessage.success('删除成功');
      console.log('当前页数据量:', orders.value.length);
      // 如果是最后一页且只有一条数据，则跳转到上一页
      if (orders.value.length === 1 && currentPage.value > 1) {
        console.log('跳转到上一页');
        currentPage.value--;
      }
      await fetchOrders();
    } else {
      console.warn('删除失败，服务器返回false');
      ElMessage.error('删除失败，请稍后重试');
    }
    
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除订单失败:', error);
      console.error('错误响应:', error.response);
      const errorMessage = error.response?.data?.message || '删除失败，请稍后重试';
      ElMessage.error(errorMessage);
    }
  } finally {
    loading.value = false;
  }
}

// 显示订单详情
const handleShowDetail = (order: AdminOrder) => {
  currentOrder.value = order
  detailVisible.value = true
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchOrders()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchOrders()
}

// 初始化
fetchOrders()
</script>

<style scoped>
.orders-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  gap: 16px;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.order-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.detail-item .label {
  width: 100px;
  color: #606266;
}
</style> 