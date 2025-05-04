<template>
  <div class="reservations-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>预约管理</span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名/场地名称"
            style="width: 200px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon class="el-input__icon" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </template>
      
      <el-table 
        :data="filteredReservations" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="id" label="预约编号" width="100" />
        <el-table-column prop="userName" label="用户名" width="120" />
        <el-table-column prop="venueName" label="场地名称" width="120" />
        <el-table-column prop="date" label="预约日期" width="120" />
        <el-table-column prop="timeSlot" label="时间段" width="120" />
        <el-table-column prop="partnerName" label="陪练" width="120">
          <template #default="scope">
            {{ scope.row.partnerName || '无' }}
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
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { adminReservationService } from '@/api/adminServices'
import type { AdminReservation } from '@/types/api'

const loading = ref(false)
const reservations = ref<AdminReservation[]>([])
const searchQuery = ref('')

// 状态映射
const statusMap = {
  pending: { type: 'warning', text: '待审核' },
  approved: { type: 'success', text: '已通过' },
  rejected: { type: 'danger', text: '已拒绝' },
  cancelled: { type: 'info', text: '已取消' }
}

// 过滤后的预约列表
const filteredReservations = computed(() => {
  if (!searchQuery.value) return reservations.value
  
  const query = searchQuery.value.toLowerCase()
  return reservations.value.filter(reservation => 
    reservation.userName.toLowerCase().includes(query) ||
    reservation.venueName.toLowerCase().includes(query)
  )
})

// 获取状态样式
const getStatusType = (status: string) => {
  return statusMap[status as keyof typeof statusMap]?.type || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  return statusMap[status as keyof typeof statusMap]?.text || status
}

// 获取预约列表
const fetchReservations = async () => {
  try {
    loading.value = true
    const response = await adminReservationService.getAllReservations()
    reservations.value = response.data
  } catch (error) {
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

// 更新预约状态
const handleUpdateStatus = async (reservation: AdminReservation, status: string) => {
  try {
    const action = status === 'approved' ? '通过' : '拒绝'
    await ElMessageBox.confirm(
      `确定要${action}该预约吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await adminReservationService.updateReservationStatus(reservation.id!, status)
    ElMessage.success(`${action}成功`)
    fetchReservations()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 搜索
const handleSearch = () => {
  // 触发计算属性重新计算
  searchQuery.value = searchQuery.value
}

onMounted(() => {
  fetchReservations()
})
</script>

<style scoped>
.reservations-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 