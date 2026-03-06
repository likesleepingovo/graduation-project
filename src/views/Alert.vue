<template>
  <Layout>
    <div class="alert-content">
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <h2>预警与报警</h2>
            <div class="header-buttons">
              <el-button type="primary" @click="acknowledgeAll">全部确认</el-button>
            </div>
          </div>
        </template>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="实时告警" name="realtime">
            <el-table :data="alerts" style="width: 100%">
              <el-table-column prop="id" label="告警ID" width="100" />
              <el-table-column prop="time" label="告警时间" width="180" />
              <el-table-column prop="level" label="告警级别" width="120">
                <template #default="scope">
                  <el-tag :type="getLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="告警类型" />
              <el-table-column prop="point" label="监测点" />
              <el-table-column prop="message" label="告警信息" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '已确认' ? 'success' : 'warning'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="primary" 
                    @click="acknowledgeAlert(scope.row.id)"
                    :disabled="scope.row.status === '已确认'"
                  >
                    确认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="历史告警" name="history">
            <el-form :inline="true" class="search-form">
              <el-form-item label="告警级别">
                <el-select v-model="alertLevel" placeholder="选择级别">
                  <el-option label="所有级别" value="" />
                  <el-option label="紧急" value="紧急" />
                  <el-option label="严重" value="严重" />
                  <el-option label="警告" value="警告" />
                  <el-option label="提示" value="提示" />
                </el-select>
              </el-form-item>
              <el-form-item label="告警类型">
                <el-select v-model="alertType" placeholder="选择类型">
                  <el-option label="所有类型" value="" />
                  <el-option label="pH值异常" value="pH异常" />
                  <el-option label="溶解氧异常" value="溶解氧异常" />
                  <el-option label="浊度异常" value="浊度异常" />
                  <el-option label="温度异常" value="温度异常" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="alertDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 240px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchAlerts">查询</el-button>
              </el-form-item>
            </el-form>
            
            <el-table :data="historyAlerts" style="width: 100%">
              <el-table-column prop="id" label="告警ID" width="100" />
              <el-table-column prop="time" label="告警时间" width="180" />
              <el-table-column prop="level" label="告警级别" width="120">
                <template #default="scope">
                  <el-tag :type="getLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="告警类型" />
              <el-table-column prop="point" label="监测点" />
              <el-table-column prop="message" label="告警信息" />
              <el-table-column prop="ackTime" label="确认时间" width="180" />
              <el-table-column prop="ackUser" label="确认人" width="100" />
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
          
          <el-tab-pane label="阈值设置" name="threshold">
            <el-card class="threshold-card">
              <template #header>
                <span>水质参数阈值设置</span>
              </template>
              <el-form :model="thresholdForm" label-width="120px">
                <el-form-item label="pH值范围">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.phMin" :min="0" :max="14" :step="0.1" placeholder="最小值" />
                    </el-col>
                    <el-col :span="4" style="text-align: center;">
                      至
                    </el-col>
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.phMax" :min="0" :max="14" :step="0.1" placeholder="最大值" />
                    </el-col>
                  </el-row>
                </el-form-item>
                
                <el-form-item label="溶解氧范围(mg/L)">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.doMin" :min="0" :max="20" :step="0.1" placeholder="最小值" />
                    </el-col>
                    <el-col :span="4" style="text-align: center;">
                      至
                    </el-col>
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.doMax" :min="0" :max="20" :step="0.1" placeholder="最大值" />
                    </el-col>
                  </el-row>
                </el-form-item>
                
                <el-form-item label="浊度范围(NTU)">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.turbidityMin" :min="0" :max="100" :step="0.1" placeholder="最小值" />
                    </el-col>
                    <el-col :span="4" style="text-align: center;">
                      至
                    </el-col>
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.turbidityMax" :min="0" :max="100" :step="0.1" placeholder="最大值" />
                    </el-col>
                  </el-row>
                </el-form-item>
                
                <el-form-item label="温度范围(℃)">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.temperatureMin" :min="0" :max="100" :step="0.1" placeholder="最小值" />
                    </el-col>
                    <el-col :span="4" style="text-align: center;">
                      至
                    </el-col>
                    <el-col :span="10">
                      <el-input-number v-model="thresholdForm.temperatureMax" :min="0" :max="100" :step="0.1" placeholder="最大值" />
                    </el-col>
                  </el-row>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveThresholds">保存设置</el-button>
                  <el-button @click="resetThresholds">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
            
            <el-card class="threshold-card" style="margin-top: 20px;">
              <template #header>
                <span>预警推送设置</span>
              </template>
              <el-form :model="notificationForm" label-width="120px">
                <el-form-item label="邮件通知">
                  <el-input v-model="notificationForm.email" placeholder="请输入邮箱地址" />
                </el-form-item>
                
                <el-form-item label="短信通知">
                  <el-input v-model="notificationForm.sms" placeholder="请输入手机号码" />
                </el-form-item>
                
                <el-form-item label="告警级别">
                  <el-checkbox-group v-model="notificationForm.levels">
                    <el-checkbox label="紧急" />
                    <el-checkbox label="严重" />
                    <el-checkbox label="警告" />
                    <el-checkbox label="提示" />
                  </el-checkbox-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveNotification">保存设置</el-button>
                  <el-button @click="resetNotification">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
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

// 告警数据
const alerts = ref([
  { id: 'A001', time: '2026-03-06 10:15:30', level: '紧急', type: 'pH值异常', point: '东校区', message: 'pH值低于阈值，当前值为5.2', status: '未确认' },
  { id: 'A002', time: '2026-03-06 09:45:20', level: '警告', type: '溶解氧异常', point: '西校区', message: '溶解氧低于阈值，当前值为4.5 mg/L', status: '未确认' },
  { id: 'A003', time: '2026-03-06 08:30:15', level: '提示', type: '浊度异常', point: '南校区', message: '浊度高于阈值，当前值为15 NTU', status: '已确认' }
]);

// 历史告警数据
const historyAlerts = ref([
  { id: 'A003', time: '2026-03-06 08:30:15', level: '提示', type: '浊度异常', point: '南校区', message: '浊度高于阈值，当前值为15 NTU', ackTime: '2026-03-06 09:00:00', ackUser: 'admin' },
  { id: 'A004', time: '2026-03-05 16:45:20', level: '严重', type: 'pH值异常', point: '主供水站', message: 'pH值低于阈值，当前值为5.0', ackTime: '2026-03-05 17:00:00', ackUser: 'admin' },
  { id: 'A005', time: '2026-03-05 14:30:15', level: '警告', type: '温度异常', point: '东校区', message: '温度高于阈值，当前值为35℃', ackTime: '2026-03-05 14:45:00', ackUser: 'admin' }
]);

// 历史告警查询参数
const alertLevel = ref('');
const alertType = ref('');
const alertDateRange = ref([]);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 阈值设置表单
const thresholdForm = reactive({
  phMin: 6.5,
  phMax: 8.5,
  doMin: 5.0,
  doMax: 10.0,
  turbidityMin: 0,
  turbidityMax: 10.0,
  temperatureMin: 15.0,
  temperatureMax: 30.0
});

// 通知设置表单
const notificationForm = reactive({
  email: 'admin@example.com',
  sms: '13800138000',
  levels: ['紧急', '严重']
});

// 获取告警级别对应的标签类型
const getLevelType = (level: string) => {
  switch (level) {
    case '紧急': return 'danger';
    case '严重': return 'warning';
    case '警告': return 'info';
    case '提示': return 'success';
    default: return 'default';
  }
};

// 确认告警
const acknowledgeAlert = (id: string) => {
  const alert = alerts.value.find(item => item.id === id);
  if (alert) {
    alert.status = '已确认';
  }
};

// 全部确认
const acknowledgeAll = () => {
  alerts.value.forEach(alert => {
    alert.status = '已确认';
  });
};

// 搜索告警
const searchAlerts = () => {
  // 模拟搜索告警
  console.log('搜索告警', alertLevel.value, alertType.value, alertDateRange.value);
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

// 保存阈值设置
const saveThresholds = () => {
  // 模拟保存阈值设置
  console.log('保存阈值设置', thresholdForm);
  ElMessage.success('阈值设置保存成功');
};

// 重置阈值设置
const resetThresholds = () => {
  Object.assign(thresholdForm, {
    phMin: 6.5,
    phMax: 8.5,
    doMin: 5.0,
    doMax: 10.0,
    turbidityMin: 0,
    turbidityMax: 10.0,
    temperatureMin: 15.0,
    temperatureMax: 30.0
  });
};

// 保存通知设置
const saveNotification = () => {
  // 模拟保存通知设置
  console.log('保存通知设置', notificationForm);
  ElMessage.success('通知设置保存成功');
};

// 重置通知设置
const resetNotification = () => {
  Object.assign(notificationForm, {
    email: 'admin@example.com',
    sms: '13800138000',
    levels: ['紧急', '严重']
  });
};

// 生命周期
onMounted(() => {
  console.log('预警与报警页面已挂载');
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.threshold-card {
  margin-bottom: 20px;
}
</style>
