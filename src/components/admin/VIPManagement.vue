<template>
  <div class="container">
    <div class="movie-management">
      <h1>🎥 Quản lý Phim</h1>

      <div class="tabs">
        <button @click="selectTab('movies')" :class="{ active: currentTab === 'movies' }">Phim Lẻ</button>
        <button @click="selectTab('series')" :class="{ active: currentTab === 'series' }">Phim Bộ</button>
      </div>

      <div v-if="currentTab === 'series'" class="tab-content">
        <h2>Quản lý Phim Bộ</h2>
        <button @click="showSeriesMovieForm = true" class="add-button">Thêm Phim Bộ</button>
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm phim bộ" @input="fetchSeries" />
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>Poster</th>
              <th>Tên phim</th>
              <th>Phần</th>
              <th>Diễn viên</th>
              <th>Đạo diễn</th>
              <th>Thể loại</th>
              <th>Quốc gia</th>
              <th>Năm phát hành</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedSeries && paginatedSeries.length === 0 && !loading">
              <td colspan="14">Không có phim bộ nào phù hợp!</td>
            </tr>
            <tr v-for="(series, index) in paginatedSeries" :key="series ? series.seriesId : index" v-if="series">
              <td>{{ series.seriesId }}</td>
              <td @click="toggleEpisodes(series.seriesId)" style="cursor: pointer;">
                <img :src="series.avatarUrl" alt="Avatar" width="100" />
              </td>
              <td @click="toggleEpisodes(series.seriesId)">
                <img :src="series.posterUrl" alt="Poster" width="100" />
              </td>
              <td @click="toggleEpisodes(series.seriesId)">
                {{ series.title }}
              </td>
              <td>{{ series.season }}</td>
              <td>
                <div v-for="actor in series.actors" :key="actor.actorId">{{ actor.nameAct }}</div>
              </td>
              <td>
                <div v-for="director in series.directors" :key="director.directorID">{{ director.nameDir }}</div>
              </td>
              <td>
                <div v-for="category in series.categories" :key="category.categoryId">{{ category.categoryName }}</div>
              </td>
              <td>{{ series.nation }}</td>
              <td>{{ series.yearReleased }}</td>
              <td>{{ series.status === 1 ? "Đang hoạt động" : "Không hoạt động" }}</td>
              <td>
                <button @click="editSeries(index)">Sửa</button>
                <button @click="deleteSeries(index)">Xóa</button>
              </td>
            </tr>
            <!-- Danh sách tập phim -->
            <tr v-if="currentSeriesId === series.seriesId && episodeList.length > 0">
              <td colspan="14">
                <h3>Danh Sách Tập Phim</h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tập</th>
                      <th>Link phim</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="episode in episodeList" :key="episode.episodeId">
                      <td>{{ episode.episodeId }}</td>
                      <td>{{ episode.title }}</td>
                      <td>
                        <div v-html="episode.linkFilmUrl"></div>
                      </td>
                      <td>
                        <button @click="editEpisode(episode)">Sửa</button>
                        <button @click="deleteEpisode(episode.episodeId)">Xóa</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "", // Trường tìm kiếm
      currentTab: "series", // Tab mặc định
      seriesList: [], // Danh sách phim bộ từ API
      episodeList: [], // Danh sách tập phim
      currentSeriesId: null, // ID phim bộ hiện tại
      searchQuery: "",
      page: 1, // Trang hiện tại
      itemsPerPage: 5, // Số phim trên mỗi trang
      loading: false, // Trạng thái tải dữ liệu
    };
  },
  computed: {
    // Tổng số trang dựa trên số lượng phim bộ
    totalSeriesPages() {
      return Math.ceil(this.seriesList.length / this.itemsPerPage);
    },
    // Phân trang danh sách phim bộ
    paginatedSeries() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.seriesList.slice(start, end);
    },
  },
  methods: {
    // Gọi API để lấy danh sách phim bộ
    async fetchSeries() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:5289/api/AdminSeries", {
          params: {
            sortBy: "Title",
            search: this.searchQuery.trim()
          },
        });
        this.seriesList = response.data.sort((a, b) => a.seriesId - b.seriesId);
        this.updatePagination();
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
        this.error = "Không thể tải danh sách phim!";
      } finally {
        this.loading = false;
      }
    },

    updatePagination() {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedSeries = this.seriesList.slice(startIndex, endIndex);
    },

    // Hiển thị hoặc ẩn danh sách tập phim
    async showEpisodes(seriesId) {
      if (this.currentSeriesId === seriesId) {
        // Ẩn danh sách tập phim nếu đã hiển thị
        this.currentSeriesId = null;
        this.episodeList = [];
      } else {
        // Gọi API để lấy danh sách tập phim cho series ID được chọn
        try {
          this.loading = true; // Bắt đầu tải danh sách tập phim
          const response = await axios.get(`http://localhost:5289/api/AdminEpisode/BySeries/${seriesId}`, {
            params: { pageNumber: 1, pageSize: 10 },
          });
          console.log("Danh sách tập phim:", response.data); // Log danh sách tập phim
          this.currentSeriesId = seriesId; // Gán ID phim bộ hiện tại
          this.episodeList = response.data; // Cập nhật danh sách tập phim
        } catch (error) {
          console.error("Lỗi khi tải danh sách tập phim:", error.response?.data || error.message);
        } finally {
          this.loading = false; // Kết thúc tải danh sách tập phim
        }
      }
    },

    // Thêm tập phim
    addEpisode(seriesId) {
      console.log(`Thêm tập phim vào series ID: ${seriesId}`);
      // Thêm logic để hiển thị form thêm tập phim tại đây
    },

    // Chỉnh sửa tập phim
    editEpisode(episode) {
      console.log("Sửa tập phim:", episode);
      // Thêm logic chỉnh sửa tập phim tại đây
    },

    // Xóa tập phim
    async deleteEpisode(episodeId) {
      try {
        console.log("Xóa tập phim ID:", episodeId);
        await axios.delete(`http://localhost:5289/api/AdminEpisode/${episodeId}`);
        alert("Xóa tập phim thành công!");
        // Tải lại danh sách tập phim sau khi xóa
        await this.toggleEpisodes(this.currentSeriesId);
      } catch (error) {
        console.error("Lỗi khi xóa tập phim:", error.response?.data || error.message);
        alert("Không thể xóa tập phim!");
      }
    },

    // Cập nhật danh sách phim bộ theo trang
    updatePagination() {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedSeries = this.seriesList.slice(startIndex, endIndex);
    },

    // Chuyển trang
    changePage(newPage) {
      this.page = newPage; // Cập nhật trang hiện tại
      this.updatePagination(); // Cập nhật danh sách phân trang
    },

    // Chuyển đổi giữa các tab
    selectTab(tab) {
      this.currentTab = tab;
      this.page = 1; // Đặt lại trang về 1 khi đổi tab
      if (tab === "series") {
        this.fetchSeries(); // Gọi danh sách phim bộ khi chọn tab Phim Bộ
      }
    },
  },
  mounted() {
    this.fetchSeries(); // Tải danh sách phim bộ khi ứng dụng được gắn vào DOM
  },
};
</script>

<style scoped>
@import "/src/assets/css/admin.css";

/* Form Overlay */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-group {
  flex: 1;
}

.form-container {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #2980b9;
}


.form-group {
  margin-bottom: 15px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.movie-form {
  display: flex;
  flex-direction: column;
  /* Stack columns vertically */
}

.form-columns {
  display: flex;
  justify-content: space-between;
}

.form-column {
  width: 48%;
}

.left-column {
  margin-right: 20px;
  /* Space between columns */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4caf50;
  outline: none;
}


h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: space-between;
  /* Space buttons apart */
  margin-top: 20px;
}

.submit-button {
  width: 48%;
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}


.cancel-button {
  width: 48%;
  background: #f44336;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover,
.cancel-button:hover {
  opacity: 0.9;
}

.movie-management {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
  width: 120%;
}

.tabs {
  display: flex;
  gap: 20px;
}

.tabs button,
.add-button,
.add-button1 {
  padding: 12px 50px;
  font-size: 18px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.tabs button.active,
.add-button,
.add-button1 {
  background-color: #4caf50;
  color: white;
}

.add-button1 {
  margin-left: 10px;
}

.tab-content {
  margin-top: 30px;
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-bar input {
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.data-table th {
  background-color: #f4f4f4;
}

.edit-button,
.delete-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 5px;
  margin-top: 5px;
}

.add-button,
.add-button1 {
  background-color: rgb(12, 187, 245);
}

.delete-button {
  background-color: #f44336;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button:hover {
  background-color: #e53935;
}

.movie-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.movie-form .form-group {
  display: flex;
  flex-direction: column;
}

.movie-form .form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.movie-form .form-group input,
.movie-form .form-group select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
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

.submit-button:hover {
  background-color: #45a049;
}

.movie-list,
.series-list {
  margin-bottom: 20px;
}

.movie-list ul,
.series-list ul {
  list-style-type: none;
  padding: 0;
}

.movie-list li,
.series-list li {
  padding: 10px;
  background-color: #f0f0f0;
  margin-bottom: 5px;
  border-radius: 6px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
}

.link-film-url {
  width: 100px !important;
  height: auto !important;
}
</style>