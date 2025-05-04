<template>
  <div class="home-container">
    <el-card class="booking-card">
      <h2 class="booking-title">场馆预约</h2>
      
      <!-- 步骤条 -->
      <el-steps :active="currentStep" finish-status="success" class="booking-steps">
        <el-step title="选择日期" />
        <el-step title="选择场馆" />
        <el-step title="选择位置" />
        <el-step title="附加服务" />
        <el-step title="个人信息" />
      </el-steps>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 第一步：选择日期 -->
        <div v-if="currentStep === 0" class="date-selection">
          <h3>请选择预约日期</h3>
          <el-calendar 
            v-model="selectedDate" 
            class="booking-calendar"
            :disabled-date="isDateDisabled"
          />
        </div>

        <!-- 第二步：选择场馆 -->
        <div v-if="currentStep === 1" class="venue-selection">
          <h3>请选择场馆</h3>
          <el-radio-group v-model="selectedVenue" class="venue-options">
            <el-radio-button 
              v-for="venue in venues" 
              :key="venue.id" 
              :label="venue.id"
            >
              {{ venue.name }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 第三步：选择位置 -->
        <div v-if="currentStep === 2" class="table-selection">
          <h3>请选择具体时间段</h3>
          <div class="table-grid">
            <el-button
              v-for="table in tables"
              :key="table.id"
              :type="selectedTable === table.id ? 'primary' : 'default'"
              :disabled="!table.available"
              @click="selectTable(table.id)"
              class="table-button"
            >
              {{ `${table.startTime}-${table.endTime}` }}
              <div class="table-status" :class="{ 'status-occupied': !table.available }">
                {{ table.available ? `剩余${table.remainingSeats}个位置` : '已约满' }}
              </div>
            </el-button>
          </div>
        </div>

        <!-- 第四步：选择陪练 -->
        <div v-if="currentStep === 3" class="service-selection">
          <h3>是否需要陪练服务？</h3>
          <el-radio-group v-model="needPartner" class="partner-options">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>

          <div v-if="needPartner" class="partner-list">
            <h4>请选择陪练</h4>
            <el-radio-group v-model="selectedPartner" class="partner-options">
              <el-radio 
                v-for="partner in partners" 
                :key="partner.id" 
                :label="partner.id"
              >
                <div class="partner-card">
                  <el-avatar :size="50" :src="partner.avatar" />
                  <div class="partner-info">
                    <div class="partner-name">{{ partner.name }}</div>
                    <div class="partner-level">级别: {{ partner.level }}</div>
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 第五步：填写���信息 -->
        <div v-if="currentStep === 4" class="personal-info">
          <h3>请填写个人信息</h3>
          <el-form :model="userInfo" :rules="rules" ref="userInfoForm" label-width="100px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userInfo.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="学号" prop="id">
              <el-input v-model="userInfo.id" placeholder="请输入学号" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="userInfo.remark"
                type="textarea"
                placeholder="如有特殊要求请备注"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="step-buttons">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button
          v-if="currentStep < 4"
          type="primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          下一步
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="submitBooking"
          :disabled="!canSubmit"
        >
          提交预约
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reservationService } from '@/api/services'
import { ElMessage } from 'element-plus'
import type { Venue, TimeSlot, Partner, Reservation } from '@/types/api'

// 当前步骤
const currentStep = ref(0)

// 日期选择
const selectedDate = ref(new Date())
const availableDates = ref<string[]>([])

// 场馆选择
const selectedVenue = ref('')
const venues = ref<Venue[]>([])

// 位置选择
const selectedTable = ref('')
const tables = ref<TimeSlot[]>([])

// 陪练选择
const needPartner = ref(false)
const selectedPartner = ref('')
const partners = ref<Partner[]>([])

// 个人信息
const userInfoForm = ref<FormInstance>()
const userInfo = ref({
  name: '',
  id: '',
  phone: '',
  remark: ''
})

// 表单验证规则
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度 2 ~ 20 个字符', trigger: 'blur' }
  ],
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 10, max: 10, message: '学号长度必须为10个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

// 初始化数据
onMounted(async () => {
  await fetchAvailableDates()
})

// 监听日期变化
watch(selectedDate, async (newDate) => {
  if (newDate) {
    const dateStr = newDate.toISOString().split('T')[0]
    await fetchAvailableVenues(dateStr)
    // 重置选择
    selectedVenue.value = ''
    selectedTable.value = ''
  }
})

// 监听场馆变化
watch(selectedVenue, async (newVenueId) => {
  if (newVenueId && selectedDate.value) {
    const dateStr = selectedDate.value.toISOString().split('T')[0]
    await Promise.all([
      fetchTimeSlots(dateStr, parseInt(newVenueId)),
      fetchAvailablePartners(parseInt(newVenueId))
    ])
    // 重置选择
    selectedTable.value = ''
    selectedPartner.value = ''
  }
})

// 选择场地
const selectTable = (tableId: string) => {
  selectedTable.value = tableId
}

// 判断是否可以进行下一步
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return selectedDate.value
    case 1:
      return selectedVenue.value
    case 2:
      return selectedTable.value
    case 3:
      return !needPartner.value || (needPartner.value && selectedPartner.value)
    default:
      return true
  }
})

// 判断是否可以提交
const canSubmit = computed(() => {
  return userInfo.value.name && userInfo.value.phone
})

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 下一步
const nextStep = () => {
  if (currentStep.value < 4 && canProceed.value) {
    currentStep.value++
  }
}

// 获取可预约日期
const fetchAvailableDates = async () => {
  try {
    const response = await reservationService.getAvailableDates()
    availableDates.value = response.data
    // 如果当前选择的日期不在可用日期内，选择第一个可用日期
    if (availableDates.value.length > 0 && 
        !availableDates.value.includes(selectedDate.value.toISOString().split('T')[0])) {
      selectedDate.value = new Date(availableDates.value[0])
    }
  } catch (error) {
    ElMessage.error('获取可预约日期失败')
  }
}

// 获取可用场馆
const fetchAvailableVenues = async (date: string) => {
  try {
    const response = await reservationService.getAvailableVenues(date)
    venues.value = response.data
  } catch (error) {
    ElMessage.error('获取可用场馆失败')
  }
}

// 获取时间段状态
const fetchTimeSlots = async (date: string, venueId: number) => {
  try {
    const response = await reservationService.getTimeSlots(date, venueId)
    // 将API返回的时间段状态转换为组件需要的格式
    tables.value = Object.entries(response.data).map(([timeSlot, remainingSeats]) => ({
      id: timeSlot,  // 使用时间段字符串作为id
      startTime: timeSlot.split('-')[0],
      endTime: timeSlot.split('-')[1],
      available: remainingSeats > 0,  // 如果剩余席位大于0则可预约
      remainingSeats: remainingSeats  // 保存剩余席位数
    }))
  } catch (error) {
    ElMessage.error('获取时间段状态失败')
  }
}

// 获取可用陪练
const fetchAvailablePartners = async (venueId: number) => {
  try {
    const response = await reservationService.getAvailablePartners(venueId)
    partners.value = response.data.map(partner => ({
      ...partner,
      level: '专业级', // 这个信息可能需要从后端获取或者前端映射
      description: partner.introduction // 使用introduction作为描述
    }))
  } catch (error) {
    ElMessage.error('获取可用陪练失败')
  }
}

// 修改提交预约的处理逻辑
const submitBooking = async () => {
  if (!userInfoForm.value) return
  
  await userInfoForm.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构造预约数据
        const reservationData: Reservation = {
          date: selectedDate.value.toISOString().split('T')[0],
          venueId: parseInt(selectedVenue.value),
          timeSlot: selectedTable.value,
          needPartner: needPartner.value,
          userName: userInfo.value.name,
          studentId: userInfo.value.id,
          phoneNumber: userInfo.value.phone,
          remarks: userInfo.value.remark,
        }

        // 如果选择了陪练，添加陪练ID
        if (needPartner.value && selectedPartner.value) {
          reservationData.partnerId = parseInt(selectedPartner.value)
        }

        const response = await reservationService.submitReservation(reservationData)
        
        if (response.status === 200) {
          ElMessage.success('预约成功')
          resetForm()
        } else {
          ElMessage.error('预约失败')
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data || '预约失败，请稍后重试')
      }
    }
  })
}

// 添加重置表单的方法
const resetForm = () => {
  currentStep.value = 0
  selectedDate.value = new Date()
  selectedVenue.value = ''
  selectedTable.value = ''
  needPartner.value = false
  selectedPartner.value = ''
  if (userInfoForm.value) {
    userInfoForm.value.resetFields()
  }
}

// 修改日历组件，添加日期禁用逻辑
const isDateDisabled = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]
  return !availableDates.value.includes(dateStr)
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background: #f5f7fa;
}

.booking-card {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.booking-title {
  text-align: center;
  margin-bottom: 35px;
  color: #303133;
  font-size: 26px;
  font-weight: 600;
}

.booking-steps {
  margin-bottom: 50px;
  padding: 0 20px;
}

.step-content {
  min-height: 400px;
  padding: 30px 20px;
  background: #fafafa;
  border-radius: 8px;
}

.venue-options {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.table-button {
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.table-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-status {
  font-size: 13px;
  margin-top: 8px;
  color: #67C23A;
}

.status-occupied {
  color: #F56C6C;
}

.partner-options {
  margin-top: 25px;
}

.partner-list {
  margin-top: 35px;
}

.partner-card {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.partner-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.partner-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.partner-name {
  font-weight: 600;
  font-size: 16px;
}

.partner-level {
  font-size: 13px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.step-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }

  .booking-card {
    margin: 0;
    padding: 15px;
  }

  .booking-steps {
    padding: 0;
    margin-bottom: 30px;
  }

  .step-content {
    padding: 20px 10px;
  }

  .venue-options {
    gap: 10px;
  }

  .table-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 15px;
  }

  .table-button {
    height: 80px;
  }

  .partner-card {
    padding: 12px;
    gap: 15px;
  }

  .step-buttons {
    margin-top: 30px;
  }
}

/* 添加一些动画效果 */
.step-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>