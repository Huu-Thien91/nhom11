<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const form = ref({
  username: '',
  email: '',
  password: ''
});

const errors = ref({});
const successMessage = ref('');
const router = useRouter();

const validateForm = () => {
  errors.value = {};

  if (!form.value.username) {
    errors.value.username = 'Tên người dùng là bắt buộc';
  }

  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email không hợp lệ';
  }

  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc';
  }

  return Object.keys(errors.value).length === 0;
};

const gotoLogin = () => {
  router.push('/login');
};

const submitForm = async () => {
  try {
    console.log('form.value: ', form.value);
    const response = await fetch('http://localhost:26762/api/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });
    console.log(response);
    //console.log('Đăng ký thành công:', response.data);

    successMessage.value = 'Đăng ký thành công! Vui lòng đăng nhập.';

    // setTimeout(() => {
    //   router.push('/login');
    // }, 2000);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('Validation Errors:', error.response.data.errors);

      const apiErrors = error.response.data.errors || {};
      errors.value = {
        username: apiErrors.username ? apiErrors.username[0] : '',
        email: apiErrors.email ? apiErrors.email[0] : '',
        password: apiErrors.password ? apiErrors.password[0] : ''
      };
    } else {
      console.error('Lỗi không xác định:', error);
    }
  }

};

</script>

<template>
  <div class="auth-container">
    <h1>Đăng Ký</h1>

    <p class="success" v-if="successMessage">{{ successMessage }}</p>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="username">Tên người dùng</label>
        <input type="text" id="username" v-model="form.username" />
        <p class="error" v-if="errors.username">{{ errors.username }}</p>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" />
        <p class="error" v-if="errors.email">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="password">Mật khẩu</label>
        <input type="password" id="password" v-model="form.password" />
        <p class="error" v-if="errors.password">{{ errors.password }}</p>
      </div>

      <button type="submit">Đăng Ký</button>
      <button type="button" @click="gotoLogin">Đăng Nhập</button>
    </form>
  </div>
</template>


<style scoped>
@import "/src/assets/css/auth.css";

.msg-error {
  color: red;
}

.success {
  color: green;
  font-weight: bold;
  margin-bottom: 15px;
}
</style>
