<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="sidebar-header">
        <h3>后台管理</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/water-quality">
          <el-icon><DataAnalysis /></el-icon>
          <span>水况参数监测</span>
        </el-menu-item>
        <el-menu-item index="/data-analysis">
          <el-icon><Histogram /></el-icon>
          <span>数据管理与分析</span>
        </el-menu-item>
        <el-menu-item index="/alert">
          <el-icon><Warning /></el-icon>
          <span>预警与报警</span>
        </el-menu-item>
        <el-menu-item index="/geo-visualization">
          <el-icon><MapLocation /></el-icon>
          <span>地理信息与可视化</span>
        </el-menu-item>
        <el-menu-item index="/user-management">
          <el-icon><User /></el-icon>
          <span>用户与权限管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="top-nav">
        <div class="nav-left">
          <button class="menu-toggle">
            <el-icon><Menu /></el-icon>
          </button>
          <el-breadcrumb separator="/" class="breadcrumb">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
                    {{ item.label }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
        </div>
        <div class="nav-right">
          <span class="user-info">{{ userStore.welcomeMessage }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      
      <!-- 内容区域 -->
      <el-main class="content-area">
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts"> 
import { computed, ref, watch } from 'vue'; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from '../store/user';
import { House, DataAnalysis, User, Menu, Histogram, Warning, MapLocation } from '@element-plus/icons-vue';

// 路由和 Pinia Store 实例化
const router = useRouter(); 
const route = useRoute();
const userStore = useUserStore(); 

// 侧边栏激活项
const activeMenu = computed(() => {
  return route.path;
});

// 面包屑数据
const breadcrumbItems = computed(() => {
  const items = [];
  const path = route.path;
  
  if (path === '/home') {
    // 首页不需要额外的面包屑项
  } else if (path === '/water-quality') {
    items.push({ label: '水况参数监测' });
  } else if (path === '/data-analysis') {
    items.push({ label: '数据管理与分析' });
  } else if (path === '/alert') {
    items.push({ label: '预警与报警' });
  } else if (path === '/geo-visualization') {
    items.push({ label: '地理信息与可视化' });
  } else if (path === '/user-management') {
    items.push({ label: '用户与权限管理' });
  }
  
  return items;
});

// 退出登录
const handleLogout = () => {
  userStore.$patch({
    username: '游客',
    token: null,
    isLogin: false,
    permissions: []
  });
  router.push('/login');
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

/* 侧边栏 */
.sidebar {
  background-color: #001529;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #002140;

  h3 {
    margin: 0;
    font-size: 18px;
    color: white;
  }
}

.sidebar-menu {
  flex: 1;
  background-color: #001529 !important;

  .el-menu-item {
    color: rgba(255, 255, 255, 0.65);

    &:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    &.is-active {
      color: white;
      background-color: #1890ff !important;
    }
  }

  .el-icon {
    color: rgba(255, 255, 255, 0.65);
  }

  .is-active .el-icon {
    color: white;
  }
}

/* 主内容区 */
.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-nav {
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;

  .menu-toggle {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }
}

.breadcrumb {
  font-size: 14px;
}

.nav-right {
  display: flex;
  align-items: center;

  .user-info {
    margin-right: 20px;
    color: #666;
  }
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f0f2f5;
}
</style>
