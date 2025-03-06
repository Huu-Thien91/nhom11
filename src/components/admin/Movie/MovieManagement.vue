<template>
  <div>
    <button @click="goBack" class="back-button">← Quay lại</button>
  <div class="movie-management">

    <h1>Quản lý Phim</h1>

    <div class="tabs">
      <button @click="selectTab('manageMovies')" :class="{ active: currentTab === 'manageMovies' }">Thêm, Sửa, Xóa Phim</button>
      <button @click="selectTab('categories')" :class="{ active: currentTab === 'categories' }">Danh mục Phim</button>
      <button @click="selectTab('videoManagement')" :class="{ active: currentTab === 'videoManagement' }">Quản lý Video</button>
      <button @click="selectTab('movieDetails')" :class="{ active: currentTab === 'movieDetails' }">Thông tin Chi tiết</button>
    </div>

    <!-- Tab: Thêm, Sửa, Xóa Phim -->
    <div v-if="currentTab === 'manageMovies'" class="tab-content">
      <h2>Thêm, Sửa, Xóa Phim</h2>
      <form @submit.prevent="addMovie">
        <div class="form-group">
          <label for="name">Tên phim</label>
          <input type="text" id="name" v-model="newMovie.name" placeholder="Nhập tên phim" />
        </div>
        <div class="form-group">
          <label for="genre">Thể loại</label>
          <input type="text" id="genre" v-model="newMovie.genre" placeholder="Nhập thể loại" />
        </div>
        <button type="submit" class="add-button">Thêm phim</button>
      </form>

      <h3>Danh sách phim</h3>
      <table class="movie-table">
        <thead>
          <tr>
            <th>Tên phim</th>
            <th>Thể loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movie, index) in movies" :key="index">
            <td>{{ movie.name }}</td>
            <td>{{ movie.genre }}</td>
            <td>
              <button @click="editMovie(index)" class="edit-button">Sửa</button>
              <button @click="deleteMovie(index)" class="delete-button">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab: Danh mục Phim -->
    <div v-if="currentTab === 'categories'" class="tab-content">
      <h2>Danh mục Phim</h2>
      <form @submit.prevent="addCategory">
        <div class="form-group">
          <label for="category">Tên danh mục</label>
          <input type="text" id="category" v-model="newCategory" placeholder="Nhập tên danh mục" />
        </div>
        <button type="submit" class="add-button">Thêm danh mục</button>
      </form>
      <ul>
        <li v-for="(category, index) in categories" :key="index">{{ category }}</li>
      </ul>
    </div>

    <!-- Tab: Quản lý Video -->
    <div v-if="currentTab === 'videoManagement'" class="tab-content">
      <h2>Quản lý Video</h2>
      <form @submit.prevent="uploadVideo">
        <div class="form-group">
          <label for="videoFile">Tải lên Video</label>
          <input type="file" id="videoFile" @change="handleVideoUpload" />
        </div>
        <button type="submit" class="upload-button">Tải lên</button>
      </form>
    </div>

    <!-- Tab: Thông tin Chi tiết -->
    <div v-if="currentTab === 'movieDetails'" class="tab-content">
      <h2>Thông tin Chi tiết Phim</h2>
      <form @submit.prevent="saveMovieDetails">
        <div class="form-group">
          <label for="description">Mô tả</label>
          <textarea id="description" v-model="movieDetails.description"></textarea>
        </div>
        <div class="form-group">
          <label for="actors">Diễn viên</label>
          <input type="text" id="actors" v-model="movieDetails.actors" placeholder="Nhập tên diễn viên" />
        </div>
        <button type="submit" class="save-button">Lưu thông tin</button>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router';
const router = useRouter();


const currentTab = ref('manageMovies');
const movies = ref([]);
const newMovie = ref({ name: '', genre: '' });
const categories = ref([]);
const newCategory = ref('');
const movieDetails = ref({ description: '', actors: '' });
const selectedVideo = ref(null);

// Chuyển tab
const selectTab = (tab) => {
  currentTab.value = tab;
};

// Quản lý phim
const addMovie = () => {
  movies.value.push({ ...newMovie.value });
  newMovie.value = { name: '', genre: '' };
};
const editMovie = (index) => {
  alert(`Chỉnh sửa thông tin phim: ${movies.value[index].name}`);
};
const deleteMovie = (index) => {
  movies.value.splice(index, 1);
};

// Quản lý danh mục
const addCategory = () => {
  categories.value.push(newCategory.value);
  newCategory.value = '';
};

// Quản lý video
const handleVideoUpload = (event) => {
  selectedVideo.value = event.target.files[0];
  alert(`Video đã chọn: ${selectedVideo.value.name}`);
};
const uploadVideo = () => {
  if (selectedVideo.value) {
    alert(`Video "${selectedVideo.value.name}" đã được tải lên.`);
  } else {
    alert('Vui lòng chọn video trước khi tải lên.');
  }
};

// Thông tin phim
const saveMovieDetails = () => {
  alert('Thông tin phim đã được lưu.');
};

// Quay lại
const goBack = () => {
  router.go(-1);    
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  margin: 0;
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

.movie-management {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  animation: fadeIn 1s ease-in-out;
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

h1 {
  text-align: center;
  color: #34495e;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.tabs button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button:hover {
  background-color: #2980b9;
}

.tabs button.active {
  background-color: #1abc9c;
}

.tab-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

.add-button {
  background-color: #4CAF50;
}

.edit-button {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
}

.upload-button, .save-button {
  background-color: #3498db;
}
</style>
