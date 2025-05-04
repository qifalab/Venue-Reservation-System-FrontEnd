<template>
  <div class="venues-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>场馆管理</span>
          <el-button type="primary" @click="handleAdd">添加场馆</el-button>
        </div>
      </template>
      
      <el-table :data="venues" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="场馆名称" width="150" />
        <el-table-column prop="type" label="场馆类型" width="120" />
        <el-table-column prop="capacity" label="容量" width="100" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'info'">
              {{ scope.row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
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
        :model="venueForm" 
        :rules="rules" 
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="场馆名称" prop="name">
          <el-input v-model="venueForm.name" />
        </el-form-item>
        <el-form-item label="场馆类型" prop="type">
          <el-select v-model="venueForm.type" placeholder="请选择场馆类型">
            <el-option label="篮球场" value="basketball" />
            <el-option label="羽毛球场" value="badminton" />
            <el-option label="乒乓球室" value="pingpong" />
            <el-option label="健身房" value="gym" />
          </el-select>
        </el-form-item>
        <el-form-item label="容量" prop="capacity">
          <el-input-number v-model="venueForm.capacity" :min="1" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="venueForm.description" 
            type="textarea" 
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-switch v-model="venueForm.isActive" />
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
import { adminVenueService } from '@/api/adminServices'
import type { AdminVenue } from '@/types/api'

const loading = ref(false)
const venues = ref<AdminVenue[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const venueForm = ref<AdminVenue>({
  id: 0,
  name: '',
  type: '',
  capacity: 0,
  description: '',
  isActive: true
})

// 表单验证规则
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入场馆名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择场馆类型', trigger: 'change' }
  ],
  capacity: [
    { required: true, message: '请输入容量', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入场馆描述', trigger: 'blur' }
  ]
})

// 获取场馆列表
const fetchVenues = async () => {
  try {
    loading.value = true
    const response = await adminVenueService.getAllVenues()
    venues.value = response.data
  } catch (error) {
    ElMessage.error('获取场馆列表失败')
  } finally {
    loading.value = false
  }
}

// 添加场馆
const handleAdd = () => {
  dialogTitle.value = '添加场馆'
  venueForm.value = {
    id: 0,
    name: '',
    type: '',
    capacity: 0,
    description: '',
    isActive: true
  }
  dialogVisible.value = true
}

// 编辑场馆
const handleEdit = (venue: AdminVenue) => {
  dialogTitle.value = '编辑场馆'
  venueForm.value = { ...venue }
  dialogVisible.value = true
}

// 删除场馆
const handleDelete = async (venue: AdminVenue) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该场馆吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await adminVenueService.deleteVenue(venue.id)
    ElMessage.success('删除成功')
    fetchVenues()
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
        if (venueForm.value.id) {
          // 更新场馆
          await adminVenueService.updateVenue(venueForm.value.id, venueForm.value)
          ElMessage.success('更新成功')
        } else {
          // 添加场馆
          await adminVenueService.addVenue(venueForm.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchVenues()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

onMounted(() => {
  fetchVenues()
})
</script>

<style scoped>
.venues-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>