<template>
  <div class="admin-container">
    <el-container class="admin-layout">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
        <div class="logo-container">
          <img src="@/assets/images/logo3.png" alt="Logo" class="logo" v-if="!isCollapse">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse"/>
            <Expand v-else/>
          </el-icon>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          router
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <template #title>控制台</template>
          </el-menu-item>

          <el-menu-item index="/admin/venues">
            <el-icon><Location /></el-icon>
            <template #title>场地管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/announcements">
            <el-icon><Bell /></el-icon>
            <template #title>公告管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/orders">
            <el-icon><Document /></el-icon>
            <template #title>订单管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/trainers">
            <el-icon><UserFilled /></el-icon>
            <template #title>陪练管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-container class="main-container">
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbs" 
                                 :key="index" 
                                 :to="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" src="https://example.com/avatar.jpg"/>
                <span class="username">管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Location,
  User,
  Bell,
  UserFilled,
  DataBoard,
  Fold,
  Expand,
  Document
} from '@element-plus/icons-vue'

const isCollapse = ref(false)
const route = useRoute()

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const activeMenu = computed(() => route.path)

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => {
    return {
      path: '/' + paths.slice(0, index + 1).join('/'),
      title: path.charAt(0).toUpperCase() + path.slice(1)
    }
  })
})
</script>

<style scoped>
.admin-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.admin-layout {
  width: 100%;
  height: 100%;
}

.aside {
  height: 100%;
  background: #fff;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #dcdfe6;
  background: #fff;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  transition: all 0.3s;
}

.collapse-btn {
  color: #909399;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: #409EFF;
}

.el-menu-vertical {
  border-right: none;
  height: calc(100% - 60px);
}

.main-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: #606266;
}

.main {
  background: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 深度选择器，微调菜单样式 */
:deep(.el-menu-item) {
  height: 50px !important;
  line-height: 50px !important;
}

:deep(.el-sub-menu__title) {
  height: 50px !important;
  line-height: 50px !important;
}

:deep(.el-icon) {
  font-size: 18px;
  vertical-align: middle;
  margin-right: 5px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .aside {
    position: fixed;
    z-index: 1000;
    height: 100vh;
  }

  .main-container {
    margin-left: 64px;
  }

  .header {
    padding: 0 10px;
  }

  .username {
    display: none;
  }
}
</style>
