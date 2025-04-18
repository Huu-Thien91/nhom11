<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2> Bảng điều khiển </h2>
      <ul>
        <li><router-link to="/admin">Dashboard</router-link></li>
        <li><router-link to="/admin/movies">Quản lý phim</router-link></li>
        <li><router-link to="/admin/actors">Quản lí diễn viên </router-link></li>
        <li><router-link to="/admin/directors">Quản lí đạo diễn </router-link></li>
        <li><router-link to="/admin/categories">thể Loại</router-link></li>
        <li><router-link to="/admin/account">Quản lí hệ thống và bảo mật (admin)</router-link></li>
        <li><router-link to="/admin/user"> Quản lí người dùng</router-link></li>
        <li><router-link to="/admin/transactions">Lịch sử giao dịch</router-link></li>
        <li><router-link to="/admin/setting">Cài đặt chung</router-link></li>
        <li><router-link to="/login">Đăng xuất</router-link></li>
      </ul>
    </aside>
    <main class="main-content">
      <router-view></router-view>
      <ChartComponent></ChartComponent>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import ChartComponent from "@/components/admin/ChartComponent.vue";
</script>

<style scoped>
@import "/src/assets/css/admin.css";
</style>