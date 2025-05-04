<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(stat, index) in stats" :key="index">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预约趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <v-chart class="chart" :option="trendOption" autoresize />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>场地使用率</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart class="chart" :option="usageOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { adminDashboardService } from '@/api/adminServices'
import type { DashboardStats, TrendData, VenueUsage } from '@/types/api'
import {
  User,
  Calendar,
  Location,
  Timer
} from '@element-plus/icons-vue'

const timeRange = ref('week')
const loading = ref(false)
const dashboardStats = ref<DashboardStats>({
  totalUsers: 0,
  todayReservations: 0,
  totalVenues: 0,
  totalHours: 0
})
const trends = ref<TrendData[]>([])
const venueUsage = ref<VenueUsage[]>([])

// 统计卡片数据
const stats = computed(() => [
  {
    title: '总用户数',
    value: dashboardStats.value.totalUsers,
    icon: 'User',
    color: '#409EFF'
  },
  {
    title: '今日预约',
    value: dashboardStats.value.todayReservations,
    icon: 'Calendar',
    color: '#67C23A'
  },
  {
    title: '场地数量',
    value: dashboardStats.value.totalVenues,
    icon: 'Location',
    color: '#E6A23C'
  },
  {
    title: '使用时长',
    value: `${dashboardStats.value.totalHours}h`,
    icon: 'Timer',
    color: '#F56C6C'
  }
])

// 预约趋势图表配置
const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: trends.value.map(item => item.date)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '预约数量',
      type: 'line',
      smooth: true,
      data: trends.value.map(item => item.count),
      itemStyle: {
        color: '#409EFF'
      }
    }
  ]
}))

// 场地使用率图表配置
const usageOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}%'
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {c}%'
      },
      data: venueUsage.value.map(item => ({
        name: item.venueName,
        value: item.usageRate
      }))
    }
  ]
}))

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const [statsRes, trendsRes, usageRes] = await Promise.all([
      adminDashboardService.getStats(),
      adminDashboardService.getTrends(),
      adminDashboardService.getVenueUsage()
    ])
    
    dashboardStats.value = statsRes.data
    trends.value = trendsRes.data
    venueUsage.value = usageRes.data
  } catch (error) {
    console.error('获仪表盘数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  :deep(.el-icon) {
    font-size: 24px;
    color: #fff;
  }
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.chart {
  height: 100%;
}
</style> 