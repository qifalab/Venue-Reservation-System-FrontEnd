<template>
  <div class="trainers-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>陪练管理</span>
          <el-button type="primary" @click="handleAdd">添加陪练</el-button>
        </div>
      </template>
      
      <el-table :data="partners" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="introduction" label="简介" min-width="200" />
        <el-table-column prop="phoneNumber" label="联系电话" width="120" />
        <el-table-column prop="venueIds" label="可用场馆" width="200">
          <template #default="scope">
            {{ formatVenueIds(scope.row.venueIds) }}
          </template>
        </el-table-column>
        <el-table-column prop="isAvailable" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isAvailable ? 'success' : 'info'">
              {{ scope.row.isAvailable ? '可预约' : '休息中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button 
                size="small"
                :type="scope.row.isAvailable ? 'warning' : 'success'"
                @click="handleToggleStatus(scope.row)"
              >
                {{ scope.row.isAvailable ? '设为休息' : '设为可用' }}
              </el-button>
              <el-button 
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
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
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="500px"
    >
      <el-form 
        :model="partnerForm" 
        :rules="rules" 
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="partnerForm.name" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input 
            v-model="partnerForm.introduction" 
            type="textarea" 
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="partnerForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="可用场馆" prop="venueIds">
          <el-select 
            v-model="partnerForm.venueIds" 
            multiple 
            placeholder="请选择场馆"
          >
            <el-option
              v-for="venue in venues"
              :key="venue.id"
              :label="venue.name"
              :value="venue.id.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="isAvailable">
          <el-switch v-model="partnerForm.isAvailable" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { adminPartnerService, adminVenueService } from '@/api/adminServices'
import type { Partner, AdminVenue } from '@/types/api'

const loading = ref(false)
const partners = ref<Partner[]>([])
const venues = ref<AdminVenue[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const partnerForm = ref<Partner>({
  id: 0,
  name: '',
  introduction: '',
  venueIds: '',
  phoneNumber: '',
  isAvailable: true
})

// 表单验证规则
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入简介', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  venueIds: [
    { required: true, message: '请选择可用场馆', trigger: 'change' }
  ]
})

// 格式化场馆ID显示
const formatVenueIds = (venueIds: string) => {
  if (!venueIds) return '无'
  const ids = venueIds.split(',')
  return ids.map(id => 
    venues.value.find(v => v.id.toString() === id)?.name || id
  ).join(', ')
}

// 获取陪练列表
const fetchPartners = async () => {
  try {
    loading.value = true
    // 这里暂时使用第一个场馆的ID，实际应该根据需求调整
    const response = await adminPartnerService.getPartners(1)
    partners.value = response.data
  } catch (error) {
    ElMessage.error('获取陪练列表失败')
  } finally {
    loading.value = false
  }
}

// 获取场馆列表
const fetchVenues = async () => {
  try {
    const response = await adminVenueService.getAllVenues()
    venues.value = response.data
  } catch (error) {
    ElMessage.error('获取场馆列表失败')
  }
}

// 添加陪练
const handleAdd = () => {
  dialogTitle.value = '添加陪练'
  partnerForm.value = {
    id: 0,
    name: '',
    introduction: '',
    venueIds: '',
    phoneNumber: '',
    isAvailable: true
  }
  dialogVisible.value = true
}

// 编辑陪练
const handleEdit = (partner: Partner) => {
  dialogTitle.value = '编辑陪练'
  partnerForm.value = { ...partner }
  dialogVisible.value = true
}

// 切换陪练状态
const handleToggleStatus = async (partner: Partner) => {
  try {
    const action = partner.isAvailable ? '设为休息' : '设为可用'
    await ElMessageBox.confirm(
      `确定要${action}吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await adminPartnerService.updatePartnerStatus(partner.id!, !partner.isAvailable)
    ElMessage.success(`${action}成功`)
    fetchPartners()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 删除陪练
const handleDelete = async (partner: Partner) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该陪练吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await adminPartnerService.deletePartner(partner.id!)
    ElMessage.success('删除成功')
    fetchPartners()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (partnerForm.value.id) {
          // 更新陪练
          await adminPartnerService.updatePartner(partnerForm.value.id, partnerForm.value)
          ElMessage.success('更新成功')
        } else {
          // 添加陪练
          await adminPartnerService.addPartner(partnerForm.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchPartners()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

onMounted(() => {
  fetchVenues()
  fetchPartners()
})
</script>

<style scoped>
.trainers-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 