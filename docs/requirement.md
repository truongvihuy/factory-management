# I. Giới thiệu dự án

StarGlobal 3D đang phát triển Nền tảng Digital Twin Nhà máy – một hệ thống số hóa
toàn bộ nhà máy sản xuất thành mô hình 3D tương tác, kết hợp theo dõi dữ liệu thời gian
thực (Real-time) từ các máy móc và thiết bị IoT.
Hệ thống giúp ban quản lý nhà máy giám sát tình trạng hoạt động, phát hiện sớm sự cố,
tối ưu hóa sản xuất và hỗ trợ bảo trì dự đoán.

# II. Các yêu cầu chức năng

## 1. Quản lý Digital Twin Nhà máy

- Quản lý nhiều nhà máy / phân xưởng
- Upload và quản lý mô hình 3D + ảnh 360° của nhà máy
- Điều hướng tương tác trong không gian 360

## 2. Quản lý Máy móc & Real-time Data

- Đăng ký máy móc/thiết bị trong nhà máy
- Kết nối dữ liệu IoT thời gian thực (nhiệt độ, độ rung, tốc độ, trạng thái ON/OFF, sản lượng, năng lượng tiêu thụ…)
- Hiển thị dữ liệu real-time trên mô hình 3D
- Cảnh báo ngay lập tức khi có bất thường (overheat, stop máy, vượt ngưỡng…)

## 3. Quản lý Bảo trì & Sự cố

- Lịch bảo trì định kỳ
- Quản lý ticket sự cố
- Theo dõi lịch sử hoạt động của từng máy

## 4. Báo cáo & Phân tích

- Báo cáo tình trạng máy móc theo thời gian thực và lịch sử
- Thống kê hiệu suất sản xuất
- Báo cáo năng lượng tiêu thụ

# III. Yêu cầu kỹ thuật

Hệ thống cần được phát triển với stack công nghệ cụ thể:

- Cơ sở dữ liệu: MariaDB
- Front-end: NextJS
- Back-end: NodeJS

# Nhiệm vụ của ứng viên

## 1. Thiết kế cơ sở dữ liệu:

- Xây dựng sơ đồ Entity-Relationship Diagram (ERD) đầy đủ
- Mô tả các bảng, trường dữ liệu và mối quan hệ

## 2. Thiết kế tương tác người dùng:

- Vẽ sơ đồ Use-Case cho các actor chính: Admin / Ban quản lý nhà máy,Kỹ thuật viên bảo trì,Operator (công nhân),Viewer (khách tham quan / đối tác).
- Thiết kế User-Flow chi tiết

## 3. Lập kế hoạch triển khai:

- Đề xuất chia dự án thành các giai đoạn (Phase) và thứ tự ưu tiên.
- Đặc biệt chú ý: Làm thế nào để xử lý dữ liệu real-time hiệu quả?

## 4. Đề xuất bổ sung:

- Bạn sẽ đề xuất thêm những tính năng nào để nền tảng Digital Twin Nhà máy trở nên mạnh mẽ hơn? (Ví dụ: bảo trì dự đoán bằng AI, tích hợp AR, dashboard analytics…)
- Đề xuất giải pháp kỹ thuật cho phần Real-time Data (công nghệ nào phù hợp, cách lưu trữ, scale…).
