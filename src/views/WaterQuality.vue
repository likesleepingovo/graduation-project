<template>
  <Layout>
    <div class="water-quality-content">
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <h2>水况参数监测</h2>
            <div class="header-buttons">
              <el-button type="primary" @click="refreshData">刷新数据</el-button>
            </div>
          </div>
        </template>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="实时监测" name="realtime">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(item, index) in waterParams" :key="index">
                <el-card class="param-card">
                  <div class="param-name">{{ item.name }}</div>
                  <div class="param-value">{{ item.value }} {{ item.unit }}</div>
                  <div class="param-status" :class="item.status">{{ item.statusText }}</div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="历史数据" name="history">
            <el-form :inline="true" class="search-form">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item label="参数类型">
                <el-select v-model="paramType" placeholder="选择参数">
                  <el-option label="pH值" value="ph" />
                  <el-option label="溶解氧" value="do" />
                  <el-option label="浊度" value="turbidity" />
                  <el-option label="温度" value="temperature" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
              </el-form-item>
            </el-form>
            
            <el-table :data="historyData" style="width: 100%">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="param" label="参数" />
              <el-table-column prop="value" label="值" />
              <el-table-column prop="unit" label="单位" />
              <el-table-column prop="status" label="状态" />
            </el-table>
            
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              />
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

// 水参数数据
const waterParams = reactive([
  { name: 'pH值', value: 7.2, unit: 'pH', status: 'normal', statusText: '正常' },
  { name: '溶解氧', value: 8.5, unit: 'mg/L', status: 'normal', statusText: '正常' },
  { name: '浊度', value: 5.2, unit: 'NTU', status: 'normal', statusText: '正常' },
  { name: '温度', value: 22.5, unit: '℃', status: 'normal', statusText: '正常' },
  { name: '电导率', value: 320, unit: 'μS/cm', status: 'normal', statusText: '正常' },
  { name: '总溶解固体', value: 210, unit: 'mg/L', status: 'normal', statusText: '正常' },
  { name: '氨氮', value: 0.5, unit: 'mg/L', status: 'normal', statusText: '正常' },
  { name: 'COD', value: 15, unit: 'mg/L', status: 'normal', statusText: '正常' }
]);

// 历史数据查询参数
const dateRange = ref([]);
const paramType = ref('');

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 历史数据
const historyData = ref([
  { time: '2026-03-06 10:00:00', param: 'pH值', value: 7.2, unit: 'pH', status: '正常' },
  { time: '2026-03-06 09:30:00', param: 'pH值', value: 7.1, unit: 'pH', status: '正常' },
  { time: '2026-03-06 09:00:00', param: 'pH值', value: 7.3, unit: 'pH', status: '正常' },
  { time: '2026-03-06 08:30:00', param: 'pH值', value: 7.2, unit: 'pH', status: '正常' },
  { time: '2026-03-06 08:00:00', param: 'pH值', value: 7.2, unit: 'pH', status: '正常' }
]);

// 刷新数据
const refreshData = () => {
  // 模拟刷新数据
  console.log('刷新数据');
};

// 搜索数据
const searchData = () => {
  // 模拟搜索数据
  console.log('搜索数据', dateRange.value, paramType.value);
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

// 生命周期
onMounted(() => {
  console.log('水况参数监测页面已挂载');
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

.param-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.param-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.param-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.param-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.param-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.param-status.normal {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.param-status.warning {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.param-status.error {
  background-color: #fff1f0;
  color: #f5222d;
  border: 1px solid #ffccc7;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
