-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2018 at 06:07 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE IF NOT EXISTS `barang` (
  `id_brg` int(11) NOT NULL,
  `nama_brg` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL,
  `toko_brg` varchar(50) NOT NULL,
  `jenis_brg` varchar(30) NOT NULL,
  `jumlah_brg` int(11) NOT NULL,
  `terjual_brg` int(11) NOT NULL DEFAULT '0',
  `berat_brg` int(11) NOT NULL,
  `harga_brg` int(11) NOT NULL,
  `deskripsi_brg` text NOT NULL,
  `gambar_brg` text NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT ''
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id_brg`, `nama_brg`, `id_user`, `toko_brg`, `jenis_brg`, `jumlah_brg`, `terjual_brg`, `berat_brg`, `harga_brg`, `deskripsi_brg`, `gambar_brg`, `status`) VALUES
(1, 'Kerajinan Tangan Kayu', 1, 'Toko Kayu Jaya', 'merchandise', 10, 0, 200, 100000, 'ini adalah kerajinan tangan kayu plaet', 'a1.jpg', ''),
(2, 'test2', 2, 'toko2', 'merchandise', 10, 0, 300, 200000, 'asdasdasdasd', 'a2.png', ''),
(3, 'test3', 3, 'toko3', 'merchandise', 10, 0, 300, 300000, 'asdasdasdasd', 'a3.jpg', ''),
(4, 'test4', 4, 'toko4', 'merchandise', 10, 0, 300, 250000, 'asdasdasdasd', 'a4.jpg', ''),
(5, 'test5', 5, 'toko5', 'merchandise', 10, 0, 500, 1000000, 'asdasdasdasd', 'a5.jpg', ''),
(6, 'test6', 6, 'toko6', 'merchandise', 10, 0, 300, 500000, 'asdasdasdasd', 'a6.jpg', ''),
(7, 'test7', 7, 'toko7', 'merchandise', 10, 0, 300, 760000, 'asdasdasdasd', 'a7.jpg', ''),
(8, 'yuki joshi', 11, 'shop1', 'merchandise', 123, 0, 5000, 111111111, 'asasasasasa', '4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8/new_life_by_loundraw-d6z124f.jpg', 'd'),
(10, 'kaos2', 9, 'jualan baju', 't-shirt', 20, 0, 500, 60000, 'asdasdasdasd', 'a10.jpg', ''),
(11, 'kaos3', 9, 'jualan baju', 't-shirt', 20, 0, 500, 70000, 'asdasdasdasd', 'a11.jpg', ''),
(12, 'kaos4', 9, 'jualan baju', 't-shirt', 20, 0, 500, 55000, 'asdasdasdasd', 'a12.jpg', ''),
(13, 'kaos5', 9, 'jualan baju', 't-shirt', 20, 0, 500, 61000, 'asdasdasdasd', 'a13.jpg', ''),
(14, 'kaos6', 9, 'jualan baju', 't-shirt', 20, 0, 500, 75000, 'asdasdasdasd', 'a14.jpg', ''),
(15, 'kaos7', 9, 'jualan baju', 't-shirt', 20, 0, 500, 31000, 'asdasdasdasd', 'a15.jpg', ''),
(16, 'kaos8', 9, 'jualan baju', 't-shirt', 20, 0, 500, 67000, 'asdasdasdasd', 'a16.jpg', ''),
(17, 'kaos9', 11, 'jualan baju', 't-shirt', 19, 2, 500, 40000, 'ini adalah contoh kaos mantap', 'sample.png', ''),
(18, 'kaos11', 11, 'jualan baju', 't-shirt', 19, 1, 500, 45000, 'ini adalah contoh kaos mantap', 'sample.png', ''),
(25, 'matimatimati', 11, 'shop1', 't-shirt', 10, 0, 1000, 100000, 'mau mati', '4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8/i_can_not_kill_you__by_loundraw-d9kfpoi.jpg', 'd'),
(26, 'kaos 99', 11, 'shop1', 't-shirt', 20, 0, 200, 15000, 'sdasdsadsad', 'sample.png', ''),
(27, 'kaos 21', 11, 'shop1', 't-shirt', 123, 0, 1233, 12000, 'ojpodjgpoiw;oafdpa', 'sample.png', '');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `empid` int(11) NOT NULL,
  `name` text NOT NULL,
  `department` text NOT NULL,
  `position` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`empid`, `name`, `department`, `position`) VALUES
(1, 'farid', 'smk1', 'siswa'),
(2, 'abdul', 'undefined', 'undefined');

-- --------------------------------------------------------

--
-- Table structure for table `konfirmasi_brg`
--

CREATE TABLE IF NOT EXISTS `konfirmasi_brg` (
  `id_pesan` int(11) NOT NULL,
  `nama_pemesan` varchar(50) NOT NULL,
  `nama_instansi` varchar(50) NOT NULL,
  `nomor_hp` varchar(15) NOT NULL,
  `email` varchar(30) NOT NULL,
  `alamat` text NOT NULL,
  `nomor_pos` varchar(30) NOT NULL,
  `provinsi` varchar(30) NOT NULL,
  `kota` varchar(30) NOT NULL,
  `kecamatan` varchar(30) NOT NULL,
  `kelurahan` varchar(30) NOT NULL,
  `deskripsi` text NOT NULL,
  `kurir` text NOT NULL,
  `barang` text NOT NULL,
  `wild_brg` text NOT NULL,
  `filename` text NOT NULL,
  `tanggal` varchar(30) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT 'n'
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `konfirmasi_brg`
--

INSERT INTO `konfirmasi_brg` (`id_pesan`, `nama_pemesan`, `nama_instansi`, `nomor_hp`, `email`, `alamat`, `nomor_pos`, `provinsi`, `kota`, `kecamatan`, `kelurahan`, `deskripsi`, `kurir`, `barang`, `wild_brg`, `filename`, `tanggal`, `status`) VALUES
(14, 'enzuigiri', '-', '08117006800', 'zulfadliyunir@yahoo.co.id', 'asdas', '28811', 'Riau', 'Dumai', 'asdad', 'asdad', '', 'JNE;OKE ', '3,1;4,1', '(3)(4)', 'a1.png', '1535444980924', 'n'),
(15, 'a', 'a', 'a', 'a@a.com', 'a', '28112', 'Riau', 'Pekanbaru', 'a', 'a', 'aaa', 'JNE;OKE ', '10,2', '(10)', 'a5.jpg', '1535444259365', 'n');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE IF NOT EXISTS `pemesanan` (
  `id_pesan` int(11) NOT NULL,
  `nama_pemesan` varchar(50) NOT NULL,
  `nama_instansi` varchar(50) NOT NULL,
  `nomor_hp` varchar(15) NOT NULL,
  `email` varchar(30) NOT NULL,
  `alamat` text NOT NULL,
  `nomor_pos` varchar(30) NOT NULL,
  `provinsi` varchar(30) NOT NULL,
  `kota` varchar(30) NOT NULL,
  `kecamatan` varchar(30) NOT NULL,
  `kelurahan` varchar(30) NOT NULL,
  `deskripsi` text NOT NULL,
  `kurir` text NOT NULL,
  `barang` text NOT NULL,
  `tanggal` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pesanan_acc`
--

CREATE TABLE IF NOT EXISTS `pesanan_acc` (
  `id` int(11) NOT NULL,
  `id_pesan` int(11) NOT NULL,
  `nama_pemesan` varchar(50) NOT NULL,
  `nama_instansi` varchar(50) NOT NULL,
  `nomor_hp` varchar(15) NOT NULL,
  `email` varchar(30) NOT NULL,
  `alamat` text NOT NULL,
  `nomor_pos` varchar(30) NOT NULL,
  `provinsi` varchar(30) NOT NULL,
  `kota` varchar(30) NOT NULL,
  `kecamatan` varchar(30) NOT NULL,
  `kelurahan` varchar(30) NOT NULL,
  `deskripsi` text NOT NULL,
  `kurir` text NOT NULL,
  `barang` text NOT NULL,
  `wild_brg` text NOT NULL,
  `filename` text NOT NULL,
  `tanggal` varchar(30) NOT NULL,
  `status` varchar(1) NOT NULL DEFAULT 'b'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `class` varchar(20) NOT NULL,
  `majors` varchar(50) NOT NULL,
  `shop` varchar(50) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `name`, `class`, `majors`, `shop`, `username`, `password`, `level`) VALUES
(1, 'admin', '-', '-', '-', 'd807ef7b5001486b8bfebda62129d3791dff7426cc1b7d070707a8549d3c52c2', 'ca8bb07759054a09a7a64eca32357a68d61e12ed1f60e674c8fd7700509855c1', 1),
(11, 'sample people', 'XI / 11', 'Teknik Komputer dan Jaringan', 'shop1', '9b563ac174cfb399c256a983f7ec2fcbfc64f9d2c7e8848ed18934fa65b59e61', '27652cad4994c0cc628413940eeb56600c86cfc35447c3c775d67610bb27aa61', 2),
(24, '[]', 'X / 10', 'Teknik Otomasi Industri', 'oto2', '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945', '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id_brg`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empid`);

--
-- Indexes for table `konfirmasi_brg`
--
ALTER TABLE `konfirmasi_brg`
  ADD PRIMARY KEY (`id_pesan`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id_pesan`);

--
-- Indexes for table `pesanan_acc`
--
ALTER TABLE `pesanan_acc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id_brg` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empid` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `konfirmasi_brg`
--
ALTER TABLE `konfirmasi_brg`
  MODIFY `id_pesan` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `pemesanan`
--
ALTER TABLE `pemesanan`
  MODIFY `id_pesan` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pesanan_acc`
--
ALTER TABLE `pesanan_acc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
