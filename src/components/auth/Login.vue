<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const loginForm = ref({
  email: '',
  password: ''
});

const loginErrors = ref({});
const router = useRouter();

const validateLoginForm = () => {
  loginErrors.value = {};

  if (!loginForm.value.email) {
    loginErrors.value.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(loginForm.value.email)) {
    loginErrors.value.email = 'Email không hợp lệ';
  }

  if (!loginForm.value.password) {
    loginErrors.value.password = 'Mật khẩu là bắt buộc';
  }

  return Object.keys(loginErrors.value).length === 0;
};

const submitLoginForm = async () => {
  if (validateLoginForm()) {
    try {
      const response = await fetch('http://localhost:5289/api/AdminUser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginErrors.value.email,
          password: loginErrors.value.password
        }),
      });

      console.log('Đăng nhập thành công:', response.data);

      // Điều hướng tới trang quản trị
      router.push('/admin');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Xử lý lỗi từ API
        loginErrors.value = {
          email: error.response.data.errors.email ? error.response.data.errors.email[0] : '',
          password: error.response.data.errors.password ? error.response.data.errors.password[0] : ''
        };
      } else {
        console.error('Lỗi không xác định:', error);
      }
    }
  }
};

const goToRegister = () => {
  router.push('/register');
};

const forgotPassword = () => {
  router.push('/forgotpassword');
  console.log('Quên mật khẩu');
};

</script>

<template>
  <div class="auth-container">
    <h1>Đăng Nhập</h1>
    <form @submit.prevent="submitLoginForm">
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" v-model="loginForm.email" />
        <p class="error" v-if="loginErrors.email">{{ loginErrors.email }}</p>
      </div>

      <div class="form-group">
        <label for="login-password">Mật khẩu</label>
        <input type="password" id="login-password" v-model="loginForm.password" />
        <p class="error" v-if="loginErrors.password">{{ loginErrors.password }}</p>
      </div>

      <button type="submit">Đăng Nhập</button>
    </form>

    <button type="button" @click="goToRegister">Đăng Ký</button>
    <button type="button" @click="forgotPassword">Quên Mật Khẩu</button>
  </div>
</template>

<style scoped>
@import "/src/assets/css/auth.css";

.msg-error {
  color: red;
}
</style>
