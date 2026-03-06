<template>
  <Layout>
    <div class="user-management-content">
      <el-card class="page-card">
        <template #header>
          <div class="card-header">
            <h2>用户与权限管理</h2>
            <div class="header-buttons">
              <el-button type="primary" @click="openAddUserDialog">添加用户</el-button>
            </div>
          </div>
        </template>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="用户管理" name="users">
            <el-form :inline="true" class="search-form">
              <el-form-item label="用户名">
                <el-input v-model="searchForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="searchForm.role" placeholder="选择角色">
                  <el-option label="所有角色" value="" />
                  <el-option label="管理员" value="admin" />
                  <el-option label="操作员" value="operator" />
                  <el-option label="查看员" value="viewer" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchUsers">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
            
            <el-table :data="users" style="width: 100%">
              <el-table-column prop="id" label="用户ID" width="100" />
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="role" label="角色" width="120">
                <template #default="scope">
                  <el-tag :type="getRoleType(scope.row.role)">{{ scope.row.roleName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lastLogin" label="最后登录" width="180" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="openEditUserDialog(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
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
          
          <el-tab-pane label="角色管理" name="roles">
            <el-button type="primary" @click="openAddRoleDialog" style="margin-bottom: 20px;">添加角色</el-button>
            
            <el-table :data="roles" style="width: 100%">
              <el-table-column prop="id" label="角色ID" width="100" />
              <el-table-column prop="name" label="角色名称" />
              <el-table-column prop="description" label="角色描述" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="openEditRoleDialog(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="权限管理" name="permissions">
            <el-form :inline="true" class="search-form">
              <el-form-item label="角色">
                <el-select v-model="selectedRole" placeholder="选择角色">
                  <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loadPermissions">加载权限</el-button>
              </el-form-item>
            </el-form>
            
            <el-card v-if="selectedRole" class="permission-card">
              <template #header>
                <span>{{ selectedRoleName }} 的权限设置</span>
              </template>
              <el-tree
                :data="permissionTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedPermissions"
                @check-change="handleCheckChange"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
              />
              <div style="margin-top: 20px; text-align: right;">
                <el-button type="primary" @click="savePermissions">保存权限</el-button>
              </div>
            </el-card>
            <div v-else class="no-selection">
              <p>请选择角色查看权限</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      
      <!-- 添加用户对话框 -->
      <el-dialog
        v-model="addUserDialogVisible"
        title="添加用户"
        width="500px"
      >
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addUserForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="addUserForm.role" placeholder="选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="操作员" value="operator" />
              <el-option label="查看员" value="viewer" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="addUserForm.status" active-text="启用" inactive-text="禁用" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addUserDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 编辑用户对话框 -->
      <el-dialog
        v-model="editUserDialogVisible"
        title="编辑用户"
        width="500px"
      >
        <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" placeholder="请输入用户名" disabled />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editUserForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="editUserForm.role" placeholder="选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="操作员" value="operator" />
              <el-option label="查看员" value="viewer" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="editUserForm.status" active-text="启用" inactive-text="禁用" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editUserDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 添加角色对话框 -->
      <el-dialog
        v-model="addRoleDialogVisible"
        title="添加角色"
        width="500px"
      >
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="addRoleForm.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="addRoleForm.description" placeholder="请输入角色描述" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addRole">确定</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 编辑角色对话框 -->
      <el-dialog
        v-model="editRoleDialogVisible"
        title="编辑角色"
        width="500px"
      >
        <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="editRoleForm.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="editRoleForm.description" placeholder="请输入角色描述" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editRoleDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateRole">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import type { FormInstance } from 'element-plus';

// 激活的标签页
const activeTab = ref('users');

// 搜索表单
const searchForm = reactive({
  username: '',
  role: ''
});

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 用户数据
const users = ref([
  { id: 1, username: 'admin', name: '管理员', role: 'admin', roleName: '管理员', status: '启用', lastLogin: '2026-03-06 10:00:00' },
  { id: 2, username: 'operator1', name: '操作员1', role: 'operator', roleName: '操作员', status: '启用', lastLogin: '2026-03-06 09:30:00' },
  { id: 3, username: 'viewer1', name: '查看员1', role: 'viewer', roleName: '查看员', status: '启用', lastLogin: '2026-03-06 09:00:00' },
  { id: 4, username: 'operator2', name: '操作员2', role: 'operator', roleName: '操作员', status: '禁用', lastLogin: '2026-03-05 16:00:00' }
]);

// 角色数据
const roles = ref([
  { id: 1, name: '管理员', description: '拥有所有权限' },
  { id: 2, name: '操作员', description: '拥有操作权限' },
  { id: 3, name: '查看员', description: '只有查看权限' }
]);

// 权限树
const permissionTree = ref([
  {
    id: 1,
    name: '水况参数监测',
    children: [
      { id: 11, name: '实时监测' },
      { id: 12, name: '历史数据' }
    ]
  },
  {
    id: 2,
    name: '数据管理与分析',
    children: [
      { id: 21, name: '实时数据' },
      { id: 22, name: '统计分析' },
      { id: 23, name: '数据报表' }
    ]
  },
  {
    id: 3,
    name: '预警与报警',
    children: [
      { id: 31, name: '实时告警' },
      { id: 32, name: '历史告警' },
      { id: 33, name: '阈值设置' }
    ]
  },
  {
    id: 4,
    name: '地理信息与可视化',
    children: [
      { id: 41, name: '校园地图' },
      { id: 42, name: '可视化大屏' }
    ]
  },
  {
    id: 5,
    name: '用户与权限管理',
    children: [
      { id: 51, name: '用户管理' },
      { id: 52, name: '角色管理' },
      { id: 53, name: '权限管理' }
    ]
  }
]);

// 选中的角色
const selectedRole = ref('');
const selectedRoleName = ref('');
const checkedPermissions = ref<number[]>([]);

// 添加用户对话框
const addUserDialogVisible = ref(false);
const addUserFormRef = ref<FormInstance>();
const addUserForm = reactive({
  username: '',
  name: '',
  password: '',
  role: '',
  status: true
});
const addUserRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
};

// 编辑用户对话框
const editUserDialogVisible = ref(false);
const editUserFormRef = ref<FormInstance>();
const editUserForm = reactive({
  id: '',
  username: '',
  name: '',
  role: '',
  status: true
});
const editUserRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
};

// 添加角色对话框
const addRoleDialogVisible = ref(false);
const addRoleFormRef = ref<FormInstance>();
const addRoleForm = reactive({
  name: '',
  description: ''
});
const addRoleRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
};

// 编辑角色对话框
const editRoleDialogVisible = ref(false);
const editRoleFormRef = ref<FormInstance>();
const editRoleForm = reactive({
  id: '',
  name: '',
  description: ''
});
const editRoleRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
};

// 获取角色类型对应的标签类型
const getRoleType = (role: string) => {
  switch (role) {
    case 'admin': return 'danger';
    case 'operator': return 'warning';
    case 'viewer': return 'info';
    default: return 'default';
  }
};

// 搜索用户
const searchUsers = () => {
  // 模拟搜索用户
  console.log('搜索用户', searchForm);
};

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    username: '',
    role: ''
  });
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
};

// 打开添加用户对话框
const openAddUserDialog = () => {
  addUserDialogVisible.value = true;
  Object.assign(addUserForm, {
    username: '',
    name: '',
    password: '',
    role: '',
    status: true
  });
};

// 添加用户
const addUser = async () => {
  if (!addUserFormRef.value) return;
  
  await addUserFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟添加用户
      console.log('添加用户', addUserForm);
      addUserDialogVisible.value = false;
      ElMessage.success('用户添加成功');
    }
  });
};

// 打开编辑用户对话框
const openEditUserDialog = (user: any) => {
  editUserDialogVisible.value = true;
  Object.assign(editUserForm, {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    status: user.status === '启用'
  });
};

// 更新用户
const updateUser = async () => {
  if (!editUserFormRef.value) return;
  
  await editUserFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟更新用户
      console.log('更新用户', editUserForm);
      editUserDialogVisible.value = false;
      ElMessage.success('用户更新成功');
    }
  });
};

// 删除用户
const deleteUser = (id: number) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除用户
    console.log('删除用户', id);
    ElMessage.success('用户删除成功');
  }).catch(() => {
    // 取消删除
  });
};

// 打开添加角色对话框
const openAddRoleDialog = () => {
  addRoleDialogVisible.value = true;
  Object.assign(addRoleForm, {
    name: '',
    description: ''
  });
};

// 添加角色
const addRole = async () => {
  if (!addRoleFormRef.value) return;
  
  await addRoleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟添加角色
      console.log('添加角色', addRoleForm);
      addRoleDialogVisible.value = false;
      ElMessage.success('角色添加成功');
    }
  });
};

// 打开编辑角色对话框
const openEditRoleDialog = (role: any) => {
  editRoleDialogVisible.value = true;
  Object.assign(editRoleForm, {
    id: role.id,
    name: role.name,
    description: role.description
  });
};

// 更新角色
const updateRole = async () => {
  if (!editRoleFormRef.value) return;
  
  await editRoleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟更新角色
      console.log('更新角色', editRoleForm);
      editRoleDialogVisible.value = false;
      ElMessage.success('角色更新成功');
    }
  });
};

// 删除角色
const deleteRole = (id: number) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除角色
    console.log('删除角色', id);
    ElMessage.success('角色删除成功');
  }).catch(() => {
    // 取消删除
  });
};

// 加载权限
const loadPermissions = () => {
  // 模拟加载权限
  console.log('加载权限', selectedRole.value);
  const role = roles.value.find(r => r.id === selectedRole.value);
  if (role) {
    selectedRoleName.value = role.name;
  }
  // 模拟权限数据
  checkedPermissions.value = [1, 11, 12, 2, 21, 22, 23];
};

// 处理权限勾选变化
const handleCheckChange = (data: any, checked: boolean, indeterminate: boolean) => {
  console.log('权限变化', data, checked, indeterminate);
};

// 保存权限
const savePermissions = () => {
  // 模拟保存权限
  console.log('保存权限', selectedRole.value, checkedPermissions.value);
  ElMessage.success('权限保存成功');
};

// 生命周期
onMounted(() => {
  console.log('用户与权限管理页面已挂载');
});
</script>

<style scoped>
.user-management-content {
  
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

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-card {
  margin-top: 20px;
}

.no-selection {
  text-align: center;
  color: #999;
  padding: 40px 0;
  background-color: white;
  border-radius: 4px;
  margin-top: 20px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
