-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 14, 2019 lúc 07:23 PM
-- Phiên bản máy phục vụ: 10.4.8-MariaDB
-- Phiên bản PHP: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `online_aution`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tblcategory`
--

CREATE TABLE `tblcategory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `level` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `tblcategory`
--

INSERT INTO `tblcategory` (`id`, `name`, `level`, `parent_id`) VALUES
(1, 'LAPTOP', 1, 0),
(2, 'MSI', 2, 1),
(3, 'MSI Gaming Series', 3, 2),
(4, 'Alpha Series', 3, 2),
(5, 'GF Series', 3, 2),
(6, 'GL Series', 3, 2),
(7, 'GP Serires', 3, 2),
(8, 'GE Series', 3, 2),
(9, 'GS Series', 3, 2),
(10, 'GT Series', 3, 2),
(11, 'Content Creation', 3, 2),
(12, 'ASUS', 2, 1),
(13, 'F Gaming Series', 3, 12),
(14, 'TUF Gaming', 3, 12),
(15, 'Laptop Asus ROG', 3, 12),
(16, 'ROG Strix G', 3, 12),
(17, 'ROG Strix Scar', 3, 12),
(18, 'Zephyrus', 3, 12),
(19, 'LENOVO', 2, 1),
(20, 'Legion Gaming', 3, 19),
(21, 'DELL', 2, 1),
(22, 'Inspiron G3 Gaming', 3, 21),
(23, 'Inspiron G5 Gaming', 3, 21),
(24, 'Inspiron G7 Gaming', 3, 21),
(25, 'ACER', 2, 1),
(26, 'Aspire7', 3, 25),
(27, 'Nitro', 3, 25),
(28, 'Predator Helios', 3, 25),
(29, 'Predator Triton', 3, 25),
(30, 'HP', 2, 1),
(31, 'Pavilion Gaming', 3, 30),
(32, 'ĐẾ TẢN', 2, 1),
(33, 'Đế Cooler Master', 3, 32),
(34, 'Đế Khác', 3, 32),
(35, 'BALO', 2, 1),
(36, 'Ba Lô ASUS', 3, 35),
(37, 'Ba Lô Alienware', 3, 35),
(38, 'Ba Lô Xgear', 3, 35),
(39, 'DỊCH VỤ', 2, 1),
(40, 'Vệ sinh Laptop', 3, 39),
(41, 'Kem Tản Nhiệt', 3, 39),
(42, 'GEAR PC', 1, 0),
(43, 'Mouse', 2, 42),
(44, 'Kingston HyperX Mouse', 3, 43),
(45, 'Logitech Mouse', 3, 43),
(46, 'Razer Mouse', 3, 43),
(47, 'Asus Mouse', 3, 43),
(48, 'MSI Mouse', 3, 43),
(49, 'Mouse Hãng Khác', 3, 43),
(50, 'Keyboard', 2, 42),
(51, 'Kingston HyperX Keyboard', 3, 50),
(52, 'Rapoo Keyboard', 3, 50),
(53, 'Asus Keyboard', 3, 50),
(54, 'Durgod Keyboard', 3, 50),
(55, 'Keyboard Khác', 3, 50),
(56, 'Headphone', 2, 42),
(57, 'HKingston HyperXP Headphone', 3, 56),
(58, 'Logitech Headphone', 3, 56),
(59, 'Asus Headphone', 3, 56),
(60, 'Razer Headphone', 3, 56),
(61, 'Headphone Hãng Khác', 3, 56),
(62, 'Gamepad', 2, 42),
(63, 'Rapoo Gamepad', 3, 62),
(64, 'MSI Gamepad', 3, 62),
(65, 'Xbox Gamepad', 3, 62),
(66, 'Speaker', 2, 42),
(67, 'Logitech Speaker', 3, 66),
(68, 'Webcam', 2, 42),
(69, 'Logitech Webcam', 3, 68),
(70, 'Mouse Pad', 2, 42),
(71, 'Pad Xgear', 3, 70),
(72, 'Pad Logitech', 3, 70),
(73, 'Pad Razer', 3, 70),
(74, 'Phụ kiện HyperX', 2, 42),
(75, 'Sound Card HyperX', 3, 74),
(76, 'Đệm Tai Nghe', 3, 74),
(77, 'MÀN HÌNH', 1, 0),
(78, 'Màn hình Samsung', 2, 77),
(79, 'Màn hình AORUS', 2, 77),
(80, 'Màn hình ASUS', 2, 77),
(81, 'Màn hình DELL', 2, 77),
(82, 'Màn hình 4K', 2, 77),
(83, 'Màn hình Gaming 144Hz, 165Hz, 240Hz', 2, 77),
(84, 'LINH KIỆN', 1, 0),
(85, 'VGA', 2, 84),
(86, 'GTX 1650 4GB', 3, 85),
(87, 'GTX 1660 6GB - 1660Ti 6GB', 3, 85),
(88, 'RTX 2060 - 2060 Super', 3, 85),
(89, 'RTX 2070 - 2070 Super', 3, 85),
(90, 'RTX 2080 Supper- RTX 2080Ti', 3, 85),
(91, 'AMD Radeon Rx', 3, 85),
(92, 'Nvidia Quadro', 3, 85),
(93, 'CPU Intel', 2, 84),
(94, '8th, 9th - Coffee Lake - LGA 1151V2', 3, 93),
(95, 'CPU AMD Ryzen', 2, 84),
(96, 'AMD Ryzen 2 Series', 3, 95),
(97, 'AMD Ryzen 3 Series', 3, 95),
(98, 'Socket TR4', 3, 95),
(99, 'Mainboard Intel', 2, 84),
(100, 'Coffe Lake Mainboard - LGA1151V2', 3, 99),
(101, 'Mainboard AMD', 2, 84),
(102, 'Mainboard Socket AM4', 3, 101),
(103, 'Mainboard Socket TR4', 3, 101),
(104, 'Ram', 2, 84),
(105, 'Ram PC', 3, 104),
(106, 'Ram Laptop', 3, 104),
(107, 'Ổ Cứng HDD', 2, 84),
(108, 'HDD 2.5 inch', 3, 107),
(109, 'HDD 3.5 inch', 3, 107),
(110, 'Ổ Cứng SSD', 2, 84),
(111, 'SSD 2.5 inch', 3, 110),
(112, 'SSD M.2', 3, 110),
(113, 'PSU - Nguồn Máy Tính', 2, 84),
(114, 'Nguồn Cooler Master', 3, 113),
(115, 'Nguồn Gigabyte', 3, 113),
(116, 'Nguồn Khác', 3, 113),
(117, 'Case - Vỏ Máy', 2, 84),
(118, 'Case Cooler Master', 3, 117),
(119, 'Case Corsair', 3, 117),
(120, 'Case NZXT', 3, 117),
(121, 'Case Khác', 3, 117),
(122, 'Fan', 2, 84),
(123, 'Fan Cooler Master', 3, 122),
(124, 'Fan NZXT', 3, 122),
(125, 'Fan Khác', 3, 122),
(126, 'Tản Nhiệt Khí', 2, 84),
(127, 'Tản Nhiệt Khí Cooler Master', 3, 126),
(128, 'Tản Nhiệt Khí DeepCool', 3, 126),
(129, 'Tản Nhiệt Khí Khác', 3, 126),
(130, 'Kem Tản Nhiệt', 3, 126),
(131, 'Tản Nhiệt Nước', 2, 84),
(132, 'Tản Nhiệt Nước Cooler Master', 3, 131),
(133, 'Tản Nhiệt Nước NZXT', 3, 131),
(134, 'Cáp Kết Nối', 2, 84),
(135, 'Cáp Mạng', 3, 134),
(136, 'Cáp nguồn nối dài', 3, 134),
(137, 'GAMING CHAIR', 1, 0),
(138, 'AORUS Gaming Chair', 2, 137),
(139, 'AK Racing', 2, 137),
(140, 'Octane Series', 3, 139),
(141, 'Overture Series', 3, 139),
(142, 'Premium Series', 3, 139),
(143, 'Signature Series', 3, 139),
(144, 'DxRacer', 2, 137),
(145, 'Fomular Series', 3, 144),
(146, 'Racing Pro Series', 3, 144),
(147, 'Valkyrie Series', 3, 144),
(156, 'thư con heo', 2, 77),
(160, 'local', 2, 77);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbluser`
--

CREATE TABLE `tbluser` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_vietnamese_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8_vietnamese_ci NOT NULL,
  `address` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_vietnamese_ci NOT NULL,
  `role` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ;

--
-- Đang đổ dữ liệu cho bảng `tbluser`
--

INSERT INTO `tbluser` (`id`, `name`, `phone`, `address`, `email`, `role`, `point`, `is_active`) VALUES
(1, 'Nguyễn Thái Hoàng', '0936252722', 'c4/6d Lê Đình Chi H.Bình Chánh TP.Hồ Chí Minh', 'nthoang1996@gmail.com', '[1]', '0/0', 1),
(2, 'Võ Thanh Hiếu', '0901234567', '33/29 ĐHT 21 quận 12 TP.Hồ Chí Minh', 'zannaghazi123@gmail.com', '[2]', '6/8', 1),
(3, 'Phan Dương Phi', '0378561472', '801 Trần Xuân Soạn quận 7 TP.Hồ Chí Minh', 'phidk96@gmail.com', '[3]', '3/5', 1),
(4, 'Trần Hoàng Anh Thư', '0947874515', 'k24/7 Nguyễn Trường Tộ quận Hải Châu TP.Đà Nẵng', 'thuconheo99@gmail.com', '[2]', '8/10', 1),
(5, 'Nguyễn Văn Bảo', '0338013415', '123 Phạm Thế Hiển quận 8 TP.Hồ Chí Minh', 'nvbao62@gmail.com', '[3]', '10/10', 1),
(6, 'Nguyễn Thị Hiền', '0377385619', '325 Nguyễn Trãi quận 1 TP.Hồ Chí Minh', 'nthien67@gmail.com', '[3]', '12/0', 1),
(7, 'Cái Nhân Đức', '0975904514', '455 Lũy Bán Bích quận Tân Phú TP.Hồ Chí Minh', 'cnduc96@gmail.com', '[2,3]', '5/8', 1),
(8, 'Võ Lê Công Kết', '0869741265', '564 Võ Văn Vân H.Bình Chánh TP.Hồ Chí Minh', 'vlcket96@gmail.com', '[3]', '7/5', 1),
(9, 'Trịnh Đại Phát', '0125647569', '756 Trần Văn Giàu H.Bình Chánh TP.Hồ Chí Minh', 'tdphat96@gmail.com', '[3]', '12/10', 1),
(10, 'Lê Xuân Kha', '(08) 3920 0', '106C Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'lxkha@gmail.com', '[3]', '8/6', 1),
(11, 'Trần Đình Khải', '(08) 3827 3', '33B Phùng Khắc Khoan, Phường Ða Kao, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'tdkhai@gmail.com', '[3]', '15/20', 1),
(12, 'Phạm Minh Khải', '(08) 3822 0', '223 Lý Tự Trọng, Phường Bình Thạnh, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'pmkhai@gmail.com', '[3]', '20/10', 1),
(13, 'Nguyễn Khắc Nguyên Khang', '(08) 3839 1', '201 Nguyễn Thị Minh Khai, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'nknkhang@gmail.com', '[3]', '20/30', 1),
(14, 'Tô Ánh Kiệt', '(08) 3960 1', '184 Phan Văn Khỏe, Phường 5, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'takiet@gmail.com', '[3]', '10/10', 1),
(15, 'Nguyễn Thanh Lâm', '(08) 3821 0', '40/34 Calmette, Phường NTB, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'ntlam@gmail.com', '[3]', '100/0', 1),
(16, 'Tô Đồng Lưu', '(08) 3837 1', '156X Bến Chương Dương, Phường Cầu Ông Lãnh, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'tdluu@gmail.com', '[3]', '30/25', 1),
(17, 'Lê Đinh Ngọc', '(08) 3839 2', '284 Cống Quỳnh, Phuờng Phạm Ngũ Lão, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'ldngoc@gmail.com', '[3]', '35/40', 1),
(18, 'Nguyễn Xuân Nguyên', '(08) 3823 8', '82 Nguyễn Du, Phường Bến Nghé, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'nxnguyen@gmail.com', '[3]', '43/43', 1),
(19, 'Châu Văn Nhật', '(08) 3848 3', '27A/1 Nguyễn Văn Nguyễn, Phường TĐ, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'cvnhat@gmail.com', '[3]', '20/0', 1),
(20, 'Hoàng Thị Hoài Nhi', '(08) 3845 3', '27A2 Trần Nhật Duật, Quận 1, Sài Gòn - TP HCM, Việt Nam', 'hthnhi@gmail.com', '[3]', '200/61', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tblcategory`
--
ALTER TABLE `tblcategory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tblcategory`
--
ALTER TABLE `tblcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT cho bảng `tbluser`
--
ALTER TABLE `tbluser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
