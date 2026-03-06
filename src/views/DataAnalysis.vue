<template>
  <Layout>
    <div class="data-analysis-content">
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <h2>数据管理与分析</h2>
            <div class="header-buttons">
              <el-button type="primary" @click="exportReport">导出报表</el-button>
            </div>
          </div>
        </template>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="实时数据" name="realtime">
            <el-form :inline="true" class="search-form">
              <el-form-item label="监测点">
                <el-select v-model="monitorPoint" placeholder="选择监测点">
                  <el-option label="主供水站" value="main" />
                  <el-option label="东校区" value="east" />
                  <el-option label="西校区" value="west" />
                  <el-option label="南校区" value="south" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="dateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
              </el-form-item>
            </el-form>
            
            <div class="chart-container">
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <span>pH值变化趋势</span>
                    <el-select v-model="chartTimeRange" size="small">
                      <el-option label="近24小时" value="24h" />
                      <el-option label="近7天" value="7d" />
                      <el-option label="近30天" value="30d" />
                    </el-select>
                  </div>
                </template>
                <div class="chart" style="height: 300px;">
                  <!-- 这里可以集成ECharts等图表库 -->
                  <div class="chart-placeholder">pH值变化趋势图表</div>
                </div>
              </el-card>
              
              <el-card class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <span>溶解氧变化趋势</span>
                    <el-select v-model="chartTimeRange" size="small">
                      <el-option label="近24小时" value="24h" />
                      <el-option label="近7天" value="7d" />
                      <el-option label="近30天" value="30d" />
                    </el-select>
                  </div>
                </template>
                <div class="chart" style="height: 300px;">
                  <!-- 这里可以集成ECharts等图表库 -->
                  <div class="chart-placeholder">溶解氧变化趋势图表</div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="统计分析" name="analysis">
            <el-form :inline="true" class="search-form">
              <el-form-item label="统计周期">
                <el-select v-model="statPeriod" placeholder="选择周期">
                  <el-option label="日" value="day" />
                  <el-option label="周" value="week" />
                  <el-option label="月" value="month" />
                  <el-option label="年" value="year" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="statDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="generateAnalysis">生成分析</el-button>
              </el-form-item>
            </el-form>
            
            <div class="analysis-result">
              <el-card class="analysis-card">
                <template #header>
                  <span>用水统计</span>
                </template>
                <el-table :data="waterUsageData" style="width: 100%">
                  <el-table-column prop="period" label="周期" />
                  <el-table-column prop="usage" label="用水量(m³)" />
                  <el-table-column prop="change" label="变化率" />
                </el-table>
              </el-card>
              
              <el-card class="analysis-card">
                <template #header>
                  <span>水质指标统计</span>
                </template>
                <el-table :data="waterQualityStats" style="width: 100%">
                  <el-table-column prop="param" label="参数" />
                  <el-table-column prop="avg" label="平均值" />
                  <el-table-column prop="max" label="最大值" />
                  <el-table-column prop="min" label="最小值" />
                  <el-table-column prop="std" label="标准差" />
                </el-table>
              </el-card>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="数据报表" name="report">
            <el-form :inline="true" class="search-form">
              <el-form-item label="报表类型">
                <el-select v-model="reportType" placeholder="选择报表类型">
                  <el-option label="日报表" value="daily" />
                  <el-option label="周报表" value="weekly" />
                  <el-option label="月报表" value="monthly" />
                  <el-option label="年报表" value="yearly" />
                </el-select>
              </el-form-item>
              <el-form-item label="日期">
                <el-date-picker
                  v-model="reportDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 180px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="generateReport">生成报表</el-button>
                <el-button @click="previewReport">预览报表</el-button>
              </el-form-item>
            </el-form>
            
            <div class="report-preview">
              <el-card class="report-card">
                <template #header>
                  <span>报表预览</span>
                </template>
                <div class="report-content">
                  <h3>校园用水监测报表</h3>
                  <p>日期：2026-03-06</p>
                  <p>报表类型：日报表</p>
                  <h4>一、用水概况</h4>
                  <p>今日总用水量：125.6 m³</p>
                  <p>昨日用水量：118.3 m³</p>
                  <p>变化率：+6.17%</p>
                  <h4>二、水质指标</h4>
                  <table class="report-table">
                    <thead>
                      <tr>
                        <th>参数</th>
                        <th>平均值</th>
                        <th>最大值</th>
                        <th>最小值</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>pH值</td>
                        <td>7.2</td>
                        <td>7.3</td>
                        <td>7.1</td>
                        <td>正常</td>
                      </tr>
                      <tr>
                        <td>溶解氧</td>
                        <td>8.5</td>
                        <td>8.7</td>
                        <td>8.3</td>
                        <td>正常</td>
                      </tr>
                      <tr>
                        <td>浊度</td>
                        <td>5.2</td>
                        <td>5.5</td>
                        <td>5.0</td>
                        <td>正常</td>
                      </tr>
                    </tbody>
                  </table>
                  <h4>三、异常情况</h4>
                  <p>无异常情况</p>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Layout from '../components/Layout.vue';

// 激活的标签页
const activeTab = ref('realtime');

// 实时数据查询参数
const monitorPoint = ref('');
const dateRange = ref([]);
const chartTimeRange = ref('24h');

// 统计分析参数
const statPeriod = ref('day');
const statDateRange = ref([]);

// 报表参数
const reportType = ref('daily');
const reportDate = ref(new Date());

// 用水统计数据
const waterUsageData = ref([
  { period: '2026-03-01', usage: 120.5, change: '+2.1%' },
  { period: '2026-03-02', usage: 118.3, change: '-1.8%' },
  { period: '2026-03-03', usage: 122.7, change: '+3.7%' },
  { period: '2026-03-04', usage: 121.2, change: '-1.2%' },
  { period: '2026-03-05', usage: 118.3, change: '-2.4%' },
  { period: '2026-03-06', usage: 125.6, change: '+6.2%' }
]);

// 水质指标统计数据
const waterQualityStats = ref([
  { param: 'pH值', avg: 7.2, max: 7.3, min: 7.1, std: 0.08 },
  { param: '溶解氧', avg: 8.5, max: 8.7, min: 8.3, std: 0.15 },
  { param: '浊度', avg: 5.2, max: 5.5, min: 5.0, std: 0.18 },
  { param: '温度', avg: 22.5, max: 23.1, min: 21.9, std: 0.42 }
]);

// 搜索数据
const searchData = () => {
  // 模拟搜索数据
  console.log('搜索数据', monitorPoint.value, dateRange.value);
};

// 生成分析
const generateAnalysis = () => {
  // 模拟生成分析
  console.log('生成分析', statPeriod.value, statDateRange.value);
};

// 生成报表
const generateReport = () => {
  // 模拟生成报表
  console.log('生成报表', reportType.value, reportDate.value);
};

// 预览报表
const previewReport = () => {
  // 模拟预览报表
  console.log('预览报表', reportType.value, reportDate.value);
};

// 导出报表
const exportReport = () => {
  // 模拟导出报表
  console.log('导出报表');
};

// 生命周期
onMounted(() => {
  console.log('数据管理与分析页面已挂载');
});
</script>

<style scoped>
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

.search-form {
  margin-bottom: 20px;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  position: relative;
  background-color: #fafafa;
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

.analysis-result {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 20px;
}

.analysis-card {
  margin-bottom: 20px;
}

.report-preview {
  margin-top: 20px;
}

.report-card {
  margin-bottom: 20px;
}

.report-content {
  padding: 20px;
}

.report-content h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.report-content h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #666;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

.report-table th,
.report-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.report-table th {
  background-color: #f5f7fa;
  font-weight: bold;
}
</style>
