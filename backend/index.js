const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");

app.use(express.json()); // Untuk memparsing JSON di request body
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware CORS di sini, sebelum rute
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Route GET untuk mendapatkan data mahasiswa
app.get("/api/inventory", (req, res) => {
  db.query("SELECT * FROM barangmasuk", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// POST route untuk menambahkan data
app.post("/api/inventory", (req, res) => {
  const { kode_barang, nama_barang, stok, harga } = req.body;
  const sql =
    "INSERT INTO barangmasuk (kode_barang, nama_barang, stok, harga) VALUES (?, ?, ?, ?)";
  db.query(sql, [kode_barang, nama_barang, stok, harga], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Barang berhasil ditambahkan" });
  });
});

// Menjalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
