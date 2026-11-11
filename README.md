# Xác suất – Thống kê Y học · tài liệu tự học

🌐 **Trang web để học:** https://hungprodegai.github.io/ss1s/

Trang web tự học theo giáo trình *Xác suất – Thống kê Y học*: mỗi bài được giảng lại từ đầu, có hình vẽ tương tác, ví dụ mới giải từng bước và bài tập chia 3 mức (thông hiểu → vận dụng → vận dụng cao).

- `index.html` — trang chủ, liệt kê các bài.
- `bai-1.html` — Bài 1. Xác suất (De Morgan, có điều kiện, nhân, cộng, toàn phần, Bayes, xét nghiệm, Bernoulli).
- `bai-2.html` — Bài 2. Phân phối xác suất của biến ngẫu nhiên (tích phân từ con số 0, mật độ, hàm phân phối, kỳ vọng, phương sai, nhị thức, chuẩn, chuẩn tắc, χ², Student, Fisher, tra bảng).
- `bai-3.html` — Bài 3. Thống kê mô tả và phân bố của các tham số trên mẫu (thang đo, chọn mẫu, bảng tần số, biểu đồ, trung bình – trung vị – mod, tứ phân vị, phương sai mẫu, phân phối của trung bình mẫu và tỉ lệ mẫu).
- `bai-4.html` — Bài 4. Ước lượng tham số tổng thể (khoảng tin cậy cho trung bình, tỉ lệ, phương sai; cỡ mẫu; bài toán ngược; hiệu hai trung bình, hai tỉ lệ).
- `bai-5.html` — Bài 5. Kiểm định giả thuyết thống kê (logic, hai loại sai lầm, miền bác bỏ, p-value; trung bình, tỉ lệ, phương sai một mẫu; hai phương sai, hai trung bình độc lập và ghép cặp, hai tỉ lệ; bài toán ngược).
- `bai-6.html` — Bài 6. Phép kiểm phi tham số (χ² tính độc lập, so sánh nhiều tỉ lệ, sự phù hợp; xếp hạng; Wilcoxon dấu và hạng một mẫu và ghép cặp, tổng hạng hai mẫu; Kruskal–Wallis).
- `bai-7.html` — Bài 7. Phân tích phương sai (ANOVA một yếu tố: lạm phát sai lầm loại 1, ba điều kiện, SS = SSB + SSW, phép kiểm F, bảng ANOVA, số liệu thô và tóm tắt, bài toán ngược; nối với phép kiểm T và Kruskal–Wallis; ANOVA hai yếu tố).
- `bai-8.html` — Bài 8. Hồi quy và tương quan (đám mây điểm, bình phương bé nhất, phương trình Y = a + bX, hệ số tương quan r, SST = SSR + SSE, phương sai hồi quy, khoảng dự báo cho Y và μY, kiểm định ρ = 0 và ρ = ρ0, so sánh phương trình hồi quy, đổi biến, hồi quy X theo Y).
- `phu-luc.html` — Bảng phụ lục 1 – 8 (thêm hai bảng Wilcoxon): mỗi bảng có bản chép đúng như giáo trình (ô in sai tô đỏ) và bản đã sửa kèm ghi chú.
- `may-tinh.html` — Bấm máy Vinacal 680EX Plus (menu kiểu Casio fx-580VN X): tổ hợp, biến nhớ, CALC, Table, Statistics (cả hồi quy y=a+bx), Distribution, tích phân. Trong các bài, khung `<div class="box calc">` (“Bấm máy”) đặt ngay chỗ cần dùng máy và dẫn link về trang này; phím ghi bằng `<span class="keys"><kbd>…</kbd></span>` (phím chức năng thêm `class="fn"`), chữ trên màn hình máy ghi bằng `<span class="lcd">…</span>`.

## Xem trên máy

Mở `index.html` bằng trình duyệt (cần mạng để tải phông chữ và KaTeX hiển thị công thức). Hoặc chạy một máy chủ tĩnh trong thư mục này:

```bash
py -m http.server 8765
```

rồi vào `http://localhost:8765`.

## Thêm bài mới (Bài 3, Bài 4, …)

1. Sao chép `bai-2.html` thành `bai-3.html`, sửa `<title>`, `data-lesson="bai-3"` ở thẻ `<body>`, phần tiêu đề và nội dung.
2. Nếu bài có phần tương tác riêng, tạo `assets/js/bai3.js` và đổi dòng `<script defer src="assets/js/bai2.js">` thành `bai3.js`.
3. Trong `assets/js/site.js`, chuyển bài đó từ mảng `COMING` sang mảng `LESSONS` (điền `id`, `href`, `no`, `title`, `desc`, `chips`). Trang chủ, thanh điều hướng và nút “Bài trước / Bài tiếp” tự cập nhật.
4. Khi sửa `style.css` hoặc `site.js`, tăng số `?v=` ở thẻ `<link>`/`<script>` của mọi trang để điện thoại không dùng bản cũ trong bộ nhớ đệm.

## Cấu trúc

```
assets/css/style.css   giao diện chung (sáng / tối, điện thoại)
assets/js/site.js      danh sách bài, mục lục tự động, KaTeX, đổi giao diện
assets/js/plot.js      hàm toán (chuẩn, nhị thức, χ², Student, Fisher) + vẽ biểu đồ SVG, cây xác suất, sơ đồ tư duy
assets/js/bai1.js      phần tương tác của Bài 1
assets/js/bai2.js      phần tương tác của Bài 2
assets/js/bai3.js … bai8.js  phần tương tác của Bài 3 – 8
assets/js/phuluc-data.js  các bảng phụ lục chép nguyên văn + danh sách ô in sai và giá trị đúng
assets/js/phuluc.js    dựng hai bản (theo giáo trình / đã sửa) cho mỗi bảng ở phu-luc.html
```
