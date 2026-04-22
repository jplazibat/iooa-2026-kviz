var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const dbConfig = require("./db.config.js");
var mysql = require("mysql");
const cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbConn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

dbConn.connect();

// ================= PLANTS =================
app.get("/plant_species", (req, res) => {
  dbConn.query("SELECT * FROM plant_species", (err, results) => {
    if (err) throw err;
    res.send({ error: false, data: results });
  });
});

app.get("/plant_species/:id", (req, res) => {
  dbConn.query(
    "SELECT * FROM plant_species WHERE id=?",
    req.params.id,
    (err, results) => {
      if (err) throw err;
      res.send({ error: false, data: results[0] });
    },
  );
});

// ================= FAMILY =================
app.get("/botanical_family", (req, res) => {
  dbConn.query("SELECT * FROM botanical_family", (err, results) => {
    if (err) throw err;
    res.send({ error: false, data: results });
  });
});

// ✔ TOČAN FAMILY
app.get("/botanical_family_plant_species/:id", (req, res) => {
  dbConn.query(
    `
    SELECT bf.id, bf.croatian_name, bf.latin_name
    FROM plant_species ps
    INNER JOIN genus g ON ps.genus_id = g.id
    INNER JOIN botanical_family bf ON g.botanical_family_id = bf.id
    WHERE ps.id = ?
    LIMIT 1
    `,
    req.params.id,
    (err, results) => {
      if (err) throw err;

      res.send({
        error: false,
        data: results[0] || null,
      });
    },
  );
});

// ================= IMAGE (100% FIXED) =================
app.get("/image/:id", (req, res) => {
  dbConn.query(
    `
    SELECT i.image_url
    FROM image i
    INNER JOIN plant_species_image psi ON i.id = psi.image_id
    WHERE psi.plant_species_id = ?
    ORDER BY RAND()
    LIMIT 1
    `,
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log("IMAGE ERROR:", err);
        return res.send({ error: true, data: null });
      }

      res.send({
        error: false,
        data: results[0] || null,
      });
    },
  );
});

// ================= GENUS =================
app.get("/genus/:id", (req, res) => {
  dbConn.query(
    `
    SELECT g.id, g.latin_name
    FROM genus g
    LEFT JOIN plant_species ps ON g.id = ps.genus_id
    WHERE ps.id = ?
    `,
    req.params.id,
    (err, results) => {
      if (err) throw err;

      res.send({
        error: false,
        data: results[0],
      });
    },
  );
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
