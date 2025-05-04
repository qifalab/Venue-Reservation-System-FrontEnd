<template>
  <el-menu
      v-if="!isAdminRoute"
      :default-active="activeIndex"
      class="nav-menu"
      mode="horizontal"
      router
      @select="handleSelect"
  >
    <div class="menu-left">
      <div class="logo-container">
        <img src="@/assets/images/logo3.png" alt="logo" class="nav-logo">
        <span class="logo-text">体育馆预约系统</span>
      </div>
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/about">关于我们</el-menu-item>
    </div>
    <div class="menu-right">
      <el-menu-item index="/login">后台登录</el-menu-item>
    </div>
  </el-menu>

  <router-view/>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = ref(route.path)

// 判断是否是管理后台路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

const handleSelect = (key: string) => {
  activeIndex.value = key
}
</script>

<style>
.nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.menu-left, .menu-right {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-right: 20px;
  cursor: pointer;
}

.nav-logo {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.el-menu-item {
  font-size: 15px;
  color: #333;
  height: 60px;
  line-height: 60px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #409eff;
  color: #409eff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-menu {
    padding: 0 10px;
  }

  .logo-container {
    padding: 0 10px;
    margin-right: 10px;
  }

  .nav-logo {
    height: 30px;
  }

  .logo-text {
    font-size: 16px;
  }

  .el-menu-item {
    padding: 0 10px;
    font-size: 14px;
  }
}

/* 在较小屏幕上隐藏 logo 文字 */
@media (max-width: 576px) {
  .logo-text {
    display: none;
  }
  
  .logo-container {
    margin-right: 5px;
  }
}
</style>
