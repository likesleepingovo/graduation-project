<template>
  <Layout>
    <div class="dashboard-content">
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
    </div>
  </Layout>
</template>

<script setup lang="ts"> 
import { onMounted } from 'vue'; 
import { useUserStore } from '../store/user';
import Layout from '../components/Layout.vue';

// Pinia Store 实例化
const userStore = useUserStore(); 

onMounted(() => {
  console.log('组件已挂载'); 
  console.log('用户信息：', userStore);
}); 
</script>

<style scoped>
.dashboard-content {
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