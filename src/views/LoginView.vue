<script setup lang="ts">
import { ref } from 'vue'
import { userService } from '@/api/services'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const stuId = ref('')
const password = ref('')
const loading = ref(false)

// 处理登录
const handleLogin = async () => {
  if (!stuId.value || !password.value) {
    ElMessage.warning('请输入学号和密码')
    return
  }

  try {
    loading.value = true
    const response = await userService.login({
      stu_id: parseInt(stuId.value),
      password: password.value
    })
    
    // 登录成功
    ElMessage.success('登录成功')
    router.push('/admin/dashboard')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <img src="@/assets/images/logo3.png" alt="成都工业学院logo">
      <h1 class="title">体育馆预约管理系统</h1>
      <form class="login-form" @submit.prevent="handleLogin">
        <el-input
          v-model="stuId"
          class="input-field"
          placeholder="请输入学号"
          :maxlength="10"
        />
        <el-input
          v-model="password"
          class="input-field"
          type="password"
          placeholder="请输入密码"
          show-password
        />
        <el-button 
          type="primary" 
          class="btn" 
          round 
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
        <el-button type="primary" plain class="btn" round>注册</el-button>
        <el-button type="primary" link class="forgot-password">忘记密码</el-button>
      </form>
    </el-card>
  </div>
</template>

<style scoped>

/* 页面整体背景全屏 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #409eff, #f6f8fb);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  background: #fff;
}

.logo {
  max-width: 120px;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
  font-family: "SimSun", serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.input-field {
  width: 100%;
}

/*button*/
.btn {
  width: 100%;
  margin-bottom: 10px;
  font-size: 15px;
  padding: 12px 0;
}
.el-button + .el-button {
  margin-left: 0;
}

.forgot-password {
  margin-top: 10px;
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}

/*适配手机端*/
@media (max-width: 480px) {
  .login-card {
    padding: 20px 15px;
  }

  .title {
    font-size: 20px;
  }

  .btn {
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>
