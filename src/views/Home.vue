<template>
  <div class="home-container">
    <!-- 侧边栏 -->
    <el-container class="full-height">
      <el-aside width="200px" class="sidebar">
        <div class="sidebar-header">
          <h3>后台管理</h3>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
        >
          <el-menu-item index="1">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据监控</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 顶部导航栏 -->
        <el-header class="top-nav">
          <div class="nav-left">
            <el-button type="text" class="menu-toggle">
              <el-icon><Menu /></el-icon>
            </el-button>
          </div>
          <div class="nav-right">
            <span class="user-info">{{ userStore.welcomeMessage }}</span>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </el-header>
        
        <!-- 内容区域 -->
        <el-main class="content-area">
          <h2>仪表盘</h2>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="dashboard-card">
                <div class="card-title">总用水量</div>
                <div class="card-value">1,234.56 m³</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="dashboard-card">
                <div class="card-title">今日用水</div>
                <div class="card-value">45.67 m³</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="dashboard-card">
                <div class="card-title">设备数量</div>
                <div class="card-value">24</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="dashboard-card">
                <div class="card-title">告警次数</div>
                <div class="card-value">3</div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts"> 
import { ref, reactive, onMounted } from 'vue'; 
import { useRouter } from 'vue-router'; 
import { useUserStore } from '../store/user';
import { House, DataAnalysis, User, Setting, Menu } from '@element-plus/icons-vue';

// 路由和 Pinia Store 实例化
const router = useRouter(); 
const userStore = useUserStore(); 

// 侧边栏激活项
const activeMenu = ref('1');

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

onMounted(() => { 
  console.log('组件已挂载'); 
  console.log('用户信息：', userStore);
}); 
</script>

<style scoped lang="scss">
.home-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.full-height {
  height: 100%;
}

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

.main-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

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
  .menu-toggle {
    color: #666;
  }
}

.nav-right {
  display: flex;
  align-items: center;

  .user-info {
    margin-right: 20px;
    color: #666;
  }
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f0f2f5;

  h2 {
    margin-bottom: 24px;
    color: #333;
  }
}

.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .card-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
}
</style>