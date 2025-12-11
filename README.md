# 🎬 Rổ Anime - Web Xem Phim Hoạt Hình Online

![Rổ Anime Banner](public/logoRoAnime.png)

> **"Nơi thỏa mãn đam mê Anime với giao diện hiện đại và trải nghiệm mượt mà."**

## 📖 Giới Thiệu

**Rổ Anime** là một dự án **Frontend thuần túy (Pure Frontend)** được xây dựng nhằm mục đích nghiên cứu và thực hành các công nghệ web hiện đại. Website tập trung tối ưu hóa giao diện người dùng (UI/UX), khả năng tương thích trên mọi thiết bị (Mobile-First) và tốc độ tải trang nhanh chóng.

Dự án này là sản phẩm tâm huyết của **Arya Kujou**, dành cho cộng đồng yêu thích Anime.

## ✨ Tính Năng Nổi Bật

*   **Giao diện hiện đại:** Thiết kế đẹp mắt, thân thiện, tối ưu trải nghiệm người dùng.
*   **Responsive Design:** Hiển thị mượt mà trên cả máy tính, máy tính bảng và điện thoại di động.
*   **Xem phim mượt mà:** Tích hợp trình phát video ổn định, hỗ trợ nhiều server.
*   **Lịch sử xem:** Tự động lưu lại tập phim đang xem dở (sử dụng LocalStorage).
*   **Thông tin chi tiết:** Hiển thị đầy đủ thông tin, nội dung, trailer và hình ảnh của Anime.
*   **Tìm kiếm & Lọc:** Dễ dàng tìm kiếm các bộ Anime yêu thích.

## 🛠 Công Nghệ Sử Dụng

Dự án được xây dựng dựa trên các công nghệ và thư viện mới nhất:

*   **Core:** [ReactJS](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/) (Tốc độ build siêu nhanh)
*   **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
*   **Routing:** [React Router Dom v6](https://reactrouter.com/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (Feather Icons)

## 🔗 Nguồn Dữ Liệu (API)

Dự án sử dụng nguồn tài nguyên API công khai và miễn phí được cung cấp bởi **KKPhim (PhimApi)**.
Xin chân thành cảm ơn đội ngũ phát triển KKPhim đã chia sẻ kho dữ liệu phim khổng lồ giúp cộng đồng lập trình viên có cơ hội thực hành.

*   **API Provider:** [KKPhim (PhimApi)](https://phimapi.com/)

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

Để chạy dự án này trên máy cá nhân của bạn, hãy làm theo các bước sau:

### 1. Clone dự án
```bash
git clone https://github.com/vy-phan/RoAnime.git
cd watchAnime
```

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
# Hoặc nếu dùng yarn
yarn install
# Hoặc nếu dùng bun 
bun install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
# Hoặc
yarn dev
# Hoặc
bun dev
```
Truy cập vào đường dẫn `http://localhost:5174` để xem kết quả.

### 4. Build cho môi trường Production
```bash
npm run build
```

## 📂 Cấu Trúc Thư Mục

```
src/
├── api/            # Cấu hình Axios và các hàm gọi API
├── assets/         # Hình ảnh, font chữ, static files
├── components/     # Các component tái sử dụng (Header, Footer, Cards...)
├── pages/          # Các trang chính (Home, MovieDetail, Watch, History...)
├── utils/          # Các hàm tiện ích (Format time, LocalStorage...)
├── App.tsx         # Component gốc và cấu hình Router
└── main.tsx        # Entry point của ứng dụng
```

## 👤 Tác Giả

Developed with ❤️ by **Arya Kujou**

---
*Lưu ý: Dự án này được xây dựng với mục đích phi lợi nhuận và học tập.*
