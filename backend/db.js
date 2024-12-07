// db.js
const mysql = require("mysql2");

// Konfigurasi koneksi ke database
const db = mysql.createConnection({
  host: "localhost", // Alamat server database
  user: "root", // Username database
  password: "", // Password database
  database: "inventory", // Nama database yang ingin dihubungkan
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err);
  } else {
    console.log("Berhasil terhubung ke database");
  }
});

module.exports = db;