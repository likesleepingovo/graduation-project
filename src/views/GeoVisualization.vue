<template>
  <Layout>
    <div class="geo-visualization-content">
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <h2>地理信息与可视化</h2>
            <div class="header-buttons">
              <el-button type="primary" @click="refreshMap">刷新地图</el-button>
            </div>
          </div>
        </template>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="校园地图" name="map">
            <div class="map-container">
              <div class="map" id="campusMap">
                <!-- 高德地图将在这里初始化 -->
              </div>
              <div class="map-sidebar">
                <h4>监测点信息</h4>
                <el-card v-if="selectedPoint" class="point-info-card">
                  <template #header>
                    <span>{{ selectedPoint.name }}</span>
                  </template>
                  <div class="point-info">
                    <p><strong>位置：</strong>{{ selectedPoint.location }}</p>
                    <p><strong>设备数量：</strong>{{ selectedPoint.deviceCount }} 个</p>
                    <p><strong>状态：</strong>
                      <el-tag :type="selectedPoint.status === '正常' ? 'success' : 'danger'">
                        {{ selectedPoint.status }}
                      </el-tag>
                    </p>
                    <h5>实时数据</h5>
                    <el-table :data="selectedPoint.data" style="width: 100%" size="small">
                      <el-table-column prop="param" label="参数" width="80" />
                      <el-table-column prop="value" label="值" />
                      <el-table-column prop="status" label="状态" width="80">
                        <template #default="scope">
                          <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                            {{ scope.row.status }}
                          </el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-card>
                <div v-else class="no-selection">
                  <p>请点击地图上的监测点查看详情</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="可视化大屏" name="dashboard">
            <div class="dashboard-container">
              <div class="dashboard-header">
                <h3>校园用水监测大屏</h3>
                <div class="dashboard-time">
                  {{ currentTime }}
                </div>
              </div>
              
              <div class="dashboard-grid">
                <div class="dashboard-item full-width">
                  <el-card class="dashboard-card">
                    <template #header>
                      <span>用水总量趋势</span>
                    </template>
                    <div class="chart" style="height: 200px;">
                      <!-- 这里可以集成ECharts等图表库 -->
                      <div class="chart-placeholder">用水总量趋势图表</div>
                    </div>
                  </el-card>
                </div>
                
                <div class="dashboard-item half-width">
                  <el-card class="dashboard-card">
                    <template #header>
                      <span>水质指标</span>
                    </template>
                    <div class="chart" style="height: 250px;">
                      <!-- 这里可以集成ECharts等图表库 -->
                      <div class="chart-placeholder">水质指标图表</div>
                    </div>
                  </el-card>
                </div>
                
                <div class="dashboard-item half-width">
                  <el-card class="dashboard-card">
                    <template #header>
                      <span>告警统计</span>
                    </template>
                    <div class="chart" style="height: 250px;">
                      <!-- 这里可以集成ECharts等图表库 -->
                      <div class="chart-placeholder">告警统计图表</div>
                    </div>
                  </el-card>
                </div>
                
                <div class="dashboard-item full-width">
                  <el-card class="dashboard-card">
                    <template #header>
                      <span>监测点状态</span>
                    </template>
                    <el-table :data="monitorPoints" style="width: 100%">
                      <el-table-column prop="name" label="监测点" />
                      <el-table-column prop="status" label="状态" width="100">
                        <template #default="scope">
                          <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                            {{ scope.row.status }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="onlineDevices" label="在线设备" width="120" />
                      <el-table-column prop="totalDevices" label="总设备" width="120" />
                      <el-table-column prop="lastUpdate" label="最后更新" width="180" />
                    </el-table>
                  </el-card>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import Layout from '../components/Layout.vue';

// 激活的标签页
const activeTab = ref('map');

// 当前时间
const currentTime = ref('');

// 选中的监测点
const selectedPoint = ref(null);

// 监测点数据
const monitorPoints = ref([
  { name: '校园中心', status: '正常', onlineDevices: 8, totalDevices: 8, lastUpdate: '2026-03-06 10:30:00' },
  { name: '宿舍', status: '正常', onlineDevices: 6, totalDevices: 6, lastUpdate: '2026-03-06 10:25:00' },
  { name: '一食堂', status: '正常', onlineDevices: 5, totalDevices: 5, lastUpdate: '2026-03-06 10:20:00' },
  { name: '三食堂', status: '警告', onlineDevices: 3, totalDevices: 4, lastUpdate: '2026-03-06 10:15:00' },
  { name: '南教学楼', status: '正常', onlineDevices: 7, totalDevices: 7, lastUpdate: '2026-03-06 10:10:00' },
  { name: '北教学楼', status: '正常', onlineDevices: 6, totalDevices: 6, lastUpdate: '2026-03-06 10:05:00' }
]);

// 监测点详细信息（包含坐标）
const pointDetails = {
  main: {
    name: '校园中心',
    location: '校园中心',
    coordinates: [116.03084222336827, 28.689751414476603], // 校园中心
    deviceCount: 8,
    status: '正常',
    data: [
      { param: 'pH值', value: 7.2, status: '正常' },
      { param: '溶解氧', value: 8.5, status: '正常' },
      { param: '浊度', value: 5.2, status: '正常' },
      { param: '温度', value: 22.5, status: '正常' }
    ]
  },
  dorm: {
    name: '宿舍',
    location: '学生宿舍区',
    coordinates: [116.03479268172946, 28.69003230110103], // 宿舍
    deviceCount: 6,
    status: '正常',
    data: [
      { param: 'pH值', value: 7.1, status: '正常' },
      { param: '溶解氧', value: 8.2, status: '正常' },
      { param: '浊度', value: 4.8, status: '正常' },
      { param: '温度', value: 22.3, status: '正常' }
    ]
  },
  canteen1: {
    name: '一食堂',
    location: '第一食堂',
    coordinates: [116.03155418497501, 28.690413773220914], // 一食堂
    deviceCount: 5,
    status: '正常',
    data: [
      { param: 'pH值', value: 7.3, status: '正常' },
      { param: '溶解氧', value: 8.0, status: '正常' },
      { param: '浊度', value: 5.0, status: '正常' },
      { param: '温度', value: 22.1, status: '正常' }
    ]
  },
  canteen3: {
    name: '三食堂',
    location: '第三食堂',
    coordinates: [116.03452182116084, 28.68806038152038], // 三食堂
    deviceCount: 4,
    status: '警告',
    data: [
      { param: 'pH值', value: 5.5, status: '异常' },
      { param: '溶解氧', value: 6.8, status: '正常' },
      { param: '浊度', value: 7.5, status: '正常' },
      { param: '温度', value: 22.7, status: '正常' }
    ]
  },
  southTeaching: {
    name: '南教学楼',
    location: '南教学楼',
    coordinates: [116.02752290528593, 28.686360108021496], // 南教学楼
    deviceCount: 7,
    status: '正常',
    data: [
      { param: 'pH值', value: 7.0, status: '正常' },
      { param: '溶解氧', value: 8.3, status: '正常' },
      { param: '浊度', value: 4.5, status: '正常' },
      { param: '温度', value: 22.0, status: '正常' }
    ]
  },
  northTeaching: {
    name: '北教学楼',
    location: '北教学楼',
    coordinates: [116.0278439197339, 28.687981992281024], // 北教学楼
    deviceCount: 6,
    status: '正常',
    data: [
      { param: 'pH值', value: 7.2, status: '正常' },
      { param: '溶解氧', value: 8.1, status: '正常' },
      { param: '浊度', value: 4.9, status: '正常' },
      { param: '温度', value: 22.4, status: '正常' }
    ]
  }
};

// 地图实例
let map: any = null;
let markers: any[] = [];

// 更新当前时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 显示监测点信息
const showPointInfo = (pointId: string) => {
  selectedPoint.value = pointDetails[pointId];
};

// 初始化地图
const initMap = () => {
  console.log('开始初始化地图');
  
  // 检查DOM元素是否存在
  const mapContainer = document.getElementById('campusMap');
  if (!mapContainer) {
    console.error('地图容器元素不存在');
    return;
  }
  
  // 清除现有地图实例
  if (map) {
    console.log('销毁现有地图实例');
    map.destroy();
  }
  
  try {
    // 初始化地图
    console.log('创建地图实例');
    map = new AMap.Map('campusMap', {
      zoom: 16,
      center: [116.03084222336827, 28.689751414476603], // 校园中心
      resizeEnable: true,
      // 添加默认控件
      plugins: ['Scale', 'ToolBar', 'MapType']
    });
    
    console.log('地图初始化成功');
    
    // 清除现有标记
    markers.forEach(marker => marker.remove());
    markers = [];
    
    // 添加监测点标记
    console.log('开始添加监测点标记');
    Object.entries(pointDetails).forEach(([pointId, pointInfo]) => {
      const coordinates = pointInfo.coordinates;
      console.log(`添加监测点: ${pointInfo.name}, 坐标: ${coordinates}`);
      
      // 创建标记（使用默认标记，确保能显示）
      const marker = new AMap.Marker({
        position: coordinates,
        title: pointInfo.name
      });
      
      // 添加点击事件
      marker.on('click', () => {
        showPointInfo(pointId);
      });
      
      // 添加到地图
      marker.setMap(map);
      markers.push(marker);
      console.log(`监测点 ${pointInfo.name} 添加成功`);
    });
    
    console.log('所有监测点标记添加完成');
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
};

// 刷新地图
const refreshMap = () => {
  console.log('刷新地图');
  initMap();
};

// 定时器
let timeInterval: number;

// 监听标签页切换
watch(activeTab, (newTab) => {
  if (newTab === 'map') {
    // 当切换到地图标签时，确保地图初始化
    setTimeout(initMap, 100);
  }
});

// 生命周期
onMounted(() => {
  console.log('地理信息与可视化页面已挂载');
  updateTime();
  timeInterval = window.setInterval(updateTime, 1000);
  
  // 初始化地图
  if (activeTab.value === 'map') {
    setTimeout(initMap, 100);
  }
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  
  // 销毁地图实例
  if (map) {
    map.destroy();
  }
});
</script>

<style scoped>
.geo-visualization-content {
  
}

.page-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

/* 地图容器 */
.map-container {
  display: flex;
  height: 600px;
  gap: 20px;
}

.map {
  flex: 1;
  background-color: #fafafa;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f7ff;
}

.map-content {
  position: relative;
  width: 80%;
  height: 80%;
  background-color: #b3d8ff;
  border-radius: 4px;
  overflow: hidden;
}

.map-content h3 {
  text-align: center;
  margin: 10px 0;
  color: #333;
}

.map-points {
  position: relative;
  width: 100%;
  height: calc(100% - 40px);
}

.map-point {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.point-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}

.point-marker.main {
  background-color: #1890ff;
}

.point-marker.east {
  background-color: #52c41a;
}

.point-marker.west {
  background-color: #faad14;
}

.point-marker.south {
  background-color: #f5222d;
}

.point-label {
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}

.map-sidebar {
  width: 300px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.map-sidebar h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.point-info-card {
  margin-bottom: 20px;
}

.point-info h5 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #666;
}

.no-selection {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 可视化大屏 */
.dashboard-container {
  background-color: #001529;
  color: white;
  border-radius: 4px;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h3 {
  margin: 0;
  font-size: 24px;
}

.dashboard-time {
  font-size: 16px;
  color: #1890ff;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}

.dashboard-item.full-width {
  grid-column: 1 / -1;
}

.dashboard-item.half-width {
  grid-column: span 1;
}

.dashboard-card {
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  color: white;
}

.dashboard-card .el-card__header {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.chart {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.chart-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}

/* 表格样式 */
.el-table {
  background-color: transparent !important;
}

.el-table th {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.el-table td {
  background-color: transparent !important;
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.el-table tr:hover > td {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
