<template>
  <div class="announcements-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>公告管理</span>
          <el-button type="primary" @click="handleAdd">发布公告</el-button>
        </div>
      </template>
      
      <el-table 
        :data="announcements" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">
              {{ scope.row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible"
      width="600px"
    >
      <el-form 
        :model="announcementForm" 
        :rules="rules" 
        ref="formRef"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="announcementForm.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="announcementForm.content" 
            type="textarea" 
            :rows="6"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="announcementForm.status">
            <el-radio label="published">立即发布</el-radio>
            <el-radio label="draft">保存草稿</el-radio>
          </el-radio-group>
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 模拟公告数据
const announcements = ref([
  {
    id: 1,
    title: '场馆维护通知',
    content: '由于设备维护，篮球场将于本周六暂停使用...',
    status: 'published',
    createTime: '2024-03-15 10:00:00',
    updateTime: '2024-03-15 10:00:00'
  },
  // ... 更多公告数据
])

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const announcementForm = ref({
  title: '',
  content: '',
  status: 'published'
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择发布状态', trigger: 'change' }
  ]
}

// 添加公告
const handleAdd = () => {
  dialogTitle.value = '发布公告'
  announcementForm.value = {
    title: '',
    content: '',
    status: 'published'
  }
  dialogVisible.value = true
}

// 编辑公告
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑公告'
  announcementForm.value = { ...row }
  dialogVisible.value = true
}

// 删除公告
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该公告吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用API删除公告
    ElMessage.success('删除成功')
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
        // TODO: 调用API保存公告
        ElMessage.success('保存成功')
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}
</script>

<style scoped>
.announcements-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 