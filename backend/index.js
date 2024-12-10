const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");

// Middleware untuk memparsing JSON dan form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Ganti dengan URL frontend Anda
  })
);

// GET route untuk mendapatkan semua data barang masuk
app.get("/api/inventory", (req, res) => {
  const sql = "SELECT * FROM barangmasuk";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error mendapatkan data:", err.message);
      return res.status(500).json({ error: "Gagal mendapatkan data" });
    }
    res.json(results);
  });
});

// POST route untuk menambahkan data barang
app.post("/api/inventory", (req, res) => {
  const { kode_barang, nama_barang, stok, harga } = req.body;

  // Validasi sederhana
  if (!kode_barang || !nama_barang || stok == null || harga == null) {
    return res.status(400).json({ error: "Semua data wajib diisi" });
  }

  const sql =
    "INSERT INTO barangmasuk (kode_barang, nama_barang, stok, harga) VALUES (?, ?, ?, ?)";
  db.query(sql, [kode_barang, nama_barang, stok, harga], (err, result) => {
    if (err) {
      console.error("Error menambahkan data:", err.message);
      return res.status(500).json({ error: "Gagal menambahkan barang" });
    }
    res.status(201).json({ message: "Barang berhasil ditambahkan" });
  });
});

// GET route untuk filter barang berdasarkan kode_barang
app.get("/api/inventory/:kode_barang", (req, res) => {
  const { kode_barang } = req.params;
  console.log("Kode Barang yang dicari:", kode_barang); // Debugging log

  const sql = "SELECT * FROM barangmasuk WHERE kode_barang = ?";
  db.query(sql, [kode_barang], (err, results) => {
    if (err) {
      console.error("Error saat mencari barang:", err.message);
      return res.status(500).json({ error: "Gagal mencari barang" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    res.json(results[0]); // Mengembalikan data barang yang ditemukan
  });
});

//edit data
app.put("/api/inventory/:kode_barang", (req, res) => {
  const { kode_barang } = req.params;
  const { nama_barang, stok, harga } = req.body;

  const sql =
    "UPDATE barangmasuk SET nama_barang = ?, stok = ?, harga = ? WHERE kode_barang = ?";
  db.query(sql, [nama_barang, stok, harga, kode_barang], (err, result) => {
    if (err) {
      console.error("Error saat memperbarui barang:", err.message);
      return res.status(500).json({ error: "Gagal memperbarui barang" });
    }
    res.json({ message: "Barang berhasil diperbarui" });
  });
});

// DELETE route untuk menghapus data barang
app.delete("/api/inventory/:kode_barang", (req, res) => {
  const { kode_barang } = req.params;
  const sql = "DELETE FROM barangmasuk WHERE kode_barang = ?";
  db.query(sql, [kode_barang], (err, result) => {
    if (err) {
      console.error("Error saat menghapus barang:", err.message);
      return res.status(500).json({ error: "Gagal menghapus barang" });
    }
    res.json({ message: "Barang berhasil dihapus" });
  });
});

// barang keluar

// GET route untuk mendapatkan semua data barang keluar
app.get("/api/barangkeluar", (req, res) => {
  const sql = "SELECT * FROM barangkeluar";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error mendapatkan data:", err.message);
      return res.status(500).json({ error: "Gagal mendapatkan data" });
    }
    res.json(results);
  });
});

// POST route untuk menambahkan data barang keluar
app.post("/api/barangkeluar", (req, res) => {
  const { kode_barang, nama_barang, jumlah, harga } = req.body;

  // Validasi sederhana
  if (!kode_barang || !nama_barang || jumlah == null || harga == null) {
    return res.status(400).json({ error: "Semua data wajib diisi" });
  }

  const sql =
    "INSERT INTO barangkeluar (kode_barang, nama_barang, jumlah, harga) VALUES (?, ?, ?, ?)";
  db.query(sql, [kode_barang, nama_barang, jumlah, harga], (err, result) => {
    if (err) {
      console.error("Error menambahkan data:", err.message);
      return res.status(500).json({ error: "Gagal menambahkan barang" });
    }
    res.status(201).json({ message: "Barang berhasil ditambahkan" });
  });
});

// Update jumlah barang keluar
app.put("/api/barangkeluar/:kode_barang", (req, res) => {
  const { kode_barang } = req.params;
  const { jumlah } = req.body;

  // Ensure jumlah is provided
  if (jumlah === undefined || jumlah === null) {
    return res.status(400).json({ error: "Jumlah harus diisi!" });
  }

  // SQL query to update jumlah
  const sql = "UPDATE barangkeluar SET jumlah = ? WHERE kode_barang = ?";

  db.query(sql, [jumlah, kode_barang], (err, result) => {
    if (err) {
      console.error("Error saat memperbarui barang:", err.message);
      return res.status(500).json({ error: "Gagal memperbarui barang" });
    }

    // Check if any row was affected (item was updated)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    }

    res.json({ message: "Jumlah barang berhasil diperbarui" });
  });
});

// data barang masuk
app.get("/api/databarangmasuk", (req, res) => {
  const sql = "SELECT kode_barang, nama_barang, harga FROM barangmasuk";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error mendapatkan data:", err.message);
      return res.status(500).json({ error: "Gagal mendapatkan data" });
    }
    res.json(results);
  });
});

// Menjalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
