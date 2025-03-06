<template>
  <div>
    <button @click="goBack" class="back-button">← Quay lại</button>
  <div class="user-management">
    <h1>Quản lý Người dùng</h1>

    <div class="tabs">
      <button @click="selectTab('accounts')" :class="{ active: currentTab === 'accounts' }">Quản lý Tài khoản</button>
      <button @click="selectTab('permissions')" :class="{ active: currentTab === 'permissions' }">Quản lý Quyền Truy cập</button>
      <button @click="selectTab('history')" :class="{ active: currentTab === 'history' }">Lịch sử Xem Phim</button>
    </div>

    <!-- Tab Quản lý Tài khoản -->
    <div v-if="currentTab === 'accounts'" class="tab-content">
      <h2>Quản lý Tài khoản Người dùng</h2>
      <table class="user-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.status }}</td>
            <td>
              <button @click="editUser(user)" class="edit-button">Sửa</button>
              <button @click="toggleUserStatus(user)" class="block-button">
                {{ user.status === 'active' ? 'Khóa' : 'Mở khóa' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab Quản lý Quyền Truy cập -->
    <div v-if="currentTab === 'permissions'" class="tab-content">
      <h2>Quản lý Quyền Truy cập</h2>
      <table class="permission-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Quyền hiện tại</th>
            <th>Thay đổi Quyền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>
              <select v-model="user.role">
                <option value="regular">Người dùng thông thường</option>
                <option value="vip">Người dùng VIP</option>
                <option value="admin">Quản trị viên</option>
              </select>
              <button @click="saveRole(user)" class="save-button">Lưu</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab Lịch sử Xem Phim -->
    <div v-if="currentTab === 'history'" class="tab-content">
      <h2>Lịch sử Xem Phim</h2>
      <table class="history-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Phim đã xem</th>
            <th>Thời gian xem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in userHistories" :key="history.id">
            <td>{{ history.name }}</td>
            <td>{{ history.movie }}</td>
            <td>{{ history.timestamp }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Tab hiện tại
const currentTab = ref('accounts');

// Dữ liệu mẫu cho người dùng
const users = ref([
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', status: 'active', role: 'regular' },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', status: 'blocked', role: 'vip' },
]);

// Lịch sử xem phim của người dùng
const userHistories = ref([
  { id: 1, name: 'Nguyễn Văn A', movie: 'Phim Hành Động', timestamp: '2023-01-01 20:00' },
  { id: 2, name: 'Trần Thị B', movie: 'Phim Tình Cảm', timestamp: '2023-02-01 18:30' },
]);

// Chuyển tab
const selectTab = (tab) => {
  currentTab.value = tab;
};

// Quay lại
const goBack = () => {
  router.go(-1);
};

// Sửa thông tin người dùng
const editUser = (user) => {
  alert(`Đang sửa thông tin người dùng: ${user.name}`);
};

// Khóa hoặc mở khóa người dùng
const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'blocked' : 'active';
  alert(`Trạng thái người dùng "${user.name}" đã thay đổi thành: ${user.status}`);
};

// Lưu quyền truy cập
const saveRole = (user) => {
  alert(`Đã thay đổi quyền truy cập cho "${user.name}" thành: ${user.role}`);
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
}

.user-management {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  animation: fadeIn 1s ease-in-out;
}

h1 {
  text-align: center;
  color: #34495e;
  font-size: 28px;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button:hover {
  background-color: #2980b9;
}

.tabs button.active {
  background-color: #1abc9c;
}

.tab-content {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.edit-button, .block-button, .save-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 5px;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.edit-button:hover {
  background-color: #2980b9;
}

.block-button {
  background-color: #e74c3c;
  color: white;
}

.block-button:hover {
  background-color: #c0392b;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}

.back-button {
  margin: 20px;
  background-color: #3498DB;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #2980B9;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
