var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const dbConfig = require("./db.config.js");
var mysql = require("mysql");
const cors = require("cors");
const knex = require("knex");

app.use(cors());
app.use(express.json());

// INICIJALIZACIJA BAZE
const db = knex({
  client: "mysql2",
  connection: {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
  },
});

app.use(
  cors({
    origin: "*",
  }),
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

// connection configurations
var dbConn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// connect to database
dbConn.connect();

// Retrieve all plant_species
app.get("/plant_species", (request, response) => {
  dbConn.query("SELECT * FROM plant_species", (error, results) => {
    if (error) throw error;
    response.send({
      error: false,
      data: results,
      message: "plant_species list.",
    });
  });
});

// Retrieve all botanical families
app.get("/botanical_family", (request, response) => {
  dbConn.query("SELECT * FROM botanical_family", (error, results) => {
    if (error) throw error;
    response.send({
      error: false,
      data: results,
      message: "botanical_family list.",
    });
  });
});

// Retrieve plant_species with id
app.get("/plant_species/:id", (request, response) => {
  let plant_species_id = request.params.id;
  if (!plant_species_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide plant_species_id",
    });
  }
  dbConn.query(
    "SELECT * FROM plant_species where id=?",
    plant_species_id,
    (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results[0],
        message: "plant_species detail.",
      });
    },
  );
});

// Retrieve plant_species by botanical_family id
app.get("/plant_species_by_bf/:id", (request, response) => {
  let botanical_family_id = request.params.id;
  if (!botanical_family_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide botanical_family_id",
    });
  }
  dbConn.query(
    `SELECT p.id, p.croatian_name, p.latin_name 
     FROM plant_species AS p 
     LEFT OUTER JOIN genus AS g ON p.genus_id=g.id 
     LEFT OUTER JOIN botanical_family AS bf ON g.botanical_family_id=bf.id 
     WHERE bf.id=?`,
    botanical_family_id,
    (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results,
        message: "plant_species list by botanical_family.",
      });
    },
  );
});

// Retrieve botanical_family with id
app.get("/botanical_family/:id", (request, response) => {
  let botanical_family_id = request.params.id;
  if (!botanical_family_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide botanical_family_id",
    });
  }
  dbConn.query(
    "SELECT * FROM botanical_family where id=?",
    botanical_family_id,
    (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results[0],
        message: "botanical_family detail.",
      });
    },
  );
});

// Retrieve all useful_part
app.get("/useful_part", (request, response) => {
  dbConn.query("SELECT * FROM useful_part", (error, results) => {
    if (error) throw error;
    response.send({
      error: false,
      data: results,
      message: "useful_part list.",
    });
  });
});

// Retrieve botanical_family for a plant_species
app.get("/botanical_family_plant_species/:id", (request, response) => {
  let plant_species_id = request.params.id;
  if (!plant_species_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide plant_species_id",
    });
  }
  dbConn.query(
    `SELECT botanical_family.id, botanical_family.croatian_name, botanical_family.latin_name 
     FROM botanical_family 
     LEFT JOIN genus ON botanical_family.id=genus.botanical_family_id 
     LEFT JOIN plant_species ON genus.id=plant_species.genus_id 
     WHERE plant_species.id=?`,
    plant_species_id,
    (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results[0],
        message: "botanical_family for plant_species.",
      });
    },
  );
});

// Retrieve image for a plant_species
app.get("/image/:id", (request, response) => {
  let plant_id = request.params.id;
  if (!plant_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide plant_id",
    });
  }
  dbConn.query(
    `SELECT i.image_url 
     FROM image i 
     LEFT JOIN plant_species_image psi ON i.id=psi.image_id 
     LEFT JOIN plant_species ps ON psi.plant_species_id=ps.id 
     WHERE ps.id=? LIMIT 1`,
    plant_id,
    (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results[0],
        message: "plant_species_image.",
      });
    },
  );
});

// Retrieve useful_part for a plant_species or useful_part by id
app.get("/useful_part/:id/:questionid", (request, response) => {
  let plant_species_id = request.params.id;
  let question_id = request.params.questionid;

  if (!plant_species_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide plant_species_id",
    });
  }

  if (question_id == 5) {
    dbConn.query(
      `SELECT ps.id, ps.croatian_name, up.croatian_name, up.latin_name 
       FROM useful_part up 
       LEFT OUTER JOIN plant_part pp ON up.id=pp.useful_part_id 
       LEFT OUTER JOIN plant_species ps ON pp.plant_species_id=ps.id 
       WHERE ps.id=?`,
      plant_species_id,
      (error, results) => {
        if (error) throw error;
        response.send({
          error: false,
          data: results,
          message: "plant_species_useful_parts.",
        });
      },
    );
  } else if (question_id == 6) {
    dbConn.query(
      "SELECT * FROM useful_part where id=?",
      plant_species_id,
      (error, results) => {
        if (error) throw error;
        response.send({
          error: false,
          data: results[0],
          message: "useful_part detail.",
        });
      },
    );
  }
});

// Dohvat biljnog roda za određenu biljnu vrstu, id biljne vrste
app.get("/genus/:id", function (request, response) {
  let plant_species_id = request.params.id;
  if (!plant_species_id) {
    return response.status(400).send({
      error: true,
      message: "Please provide plant_species_id",
    });
  }
  dbConn.query(
    "SELECT g.id, g.latin_name FROM genus g LEFT JOIN plant_species ps ON g.id=ps.genus_id WHERE ps.id=?", // SQL UPIT RADI
    plant_species_id,
    function (error, results, fields) {
      if (error) throw error;
      return response.send({
        error: false,
        data: results[0],
        message: "genus information.",
      });
    },
  );
});

// Kojoj botaničkoj porodici pripada biljka sa slikom
app.get("/plant_family_question", (req, res) => {
  const query = `
    SELECT bf.croatian_name AS family, ps.croatian_name AS plant_name
    FROM plant_species ps
    LEFT JOIN genus g ON ps.genus_id = g.id
    LEFT JOIN botanical_family bf ON g.botanical_family_id = bf.id
    LEFT JOIN image i ON ps.id = i.plant_species_id
    WHERE i.image_url IS NOT NULL
    ORDER BY RAND()
    LIMIT 1
  `;

  dbConn.query(query, (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const plant = results[0];
      const correctFamily = plant.family;

      // Prikupi ostale porodice za netočne odgovore
      const incorrectQuery = `
        SELECT DISTINCT bf.croatian_name
        FROM botanical_family bf
        WHERE bf.croatian_name != ?
        ORDER BY RAND()
        LIMIT 3
      `;

      dbConn.query(
        incorrectQuery,
        [correctFamily],
        (error, incorrectResults) => {
          if (error) throw error;

          // Kombiniraj točan i netočne odgovore
          const answers = [
            correctFamily,
            ...incorrectResults.map((row) => row.croatian_name),
          ];
          const shuffledAnswers = answers.sort(() => Math.random() - 0.5); // Random odgovor

          res.json({
            question: `Kojoj botaničkoj porodici pripada biljka sa slikom?`,
            answers: shuffledAnswers,
            correctAnswer: correctFamily,
          });
        },
      );
    } else {
      res.status(404).json({ message: "No plant found with an image." });
    }
  });
});

// dodavanje težine pitanja
app.get("/pitanje/:id", (req, res) => {
  let pitanje_id = req.params.id;
  if (!pitanje_id) {
    return res.status(400).send({
      error: true,
      message: "Please provide pitanje_id",
    });
  }

  dbConn.query(
    "SELECT * FROM pitanja WHERE id=?",
    pitanje_id,
    (error, results) => {
      if (error) throw error;
      res.send({
        error: false,
        data: results[0],
        message: "Pitanje detalji.",
      });
    },
  );
});

app.get("/api/PregledBiljaka", async (req, res) => {
  try {
    const biljke = await db("plant_species")
      .leftJoin("genus", "plant_species.genus_id", "genus.id")

      .select("plant_species.*", "genus.name as genus_name");

    res.json(biljke);
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri spajanju tablica" });
  }
});

app.get("/api/PregledBotanskihPorodica", async (req, res) => {
  try {
    const obitelji = await db("botanical_family").select("*");
    res.json(obitelji);
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri dohvatu botaničkih obitelji" });
  }
});

app.get("/api/genus_by_family/:id", async (req, res) => {
  try {
    const genus = await db("genus")
      .where({ botanical_family_id: req.params.id })
      .select("*");
    res.json(genus);
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri dohvatu rodova" });
  }
});

app.post("/api/botanical_family", async (req, res) => {
  try {
    const { croatian_name, latin_name } = req.body;
    const [id] = await db("botanical_family").insert({
      croatian_name,
      latin_name,
    });
    res.json({ id, croatian_name, latin_name });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri dodavanju porodice" });
  }
});

app.put("/api/botanical_family/:id", async (req, res) => {
  try {
    const { croatian_name, latin_name } = req.body;
    await db("botanical_family")
      .where({ id: req.params.id })
      .update({ croatian_name, latin_name });
    res.json({ id: req.params.id, croatian_name, latin_name });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri ažuriranju porodice" });
  }
});

app.delete("/api/botanical_family/:id", async (req, res) => {
  try {
    await db("botanical_family").where({ id: req.params.id }).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri brisanju porodice" });
  }
});

app.listen(3000, function () {
  console.log("Node app is running on port 3000");
});

app.get("/api/PregledRodova", async (req, res) => {
  try {
    const genus = await db("genus").select("*");
    res.json(genus);
  } catch (error) {
    console.error("SQL Greška:", error);
    res
      .status(500)
      .json({ error: "Greška pri dohvatu podataka iz tablice genus" });
  }
});

// Dodaj genus
app.post("/api/genus", async (req, res) => {
  try {
    const { name, botanical_family_id } = req.body;
    const [id] = await db("genus").insert({ name, botanical_family_id });
    res.json({ id, name, botanical_family_id });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri dodavanju roda" });
  }
});

// Uredi genus
app.put("/api/genus/:id", async (req, res) => {
  try {
    const { name } = req.body;
    await db("genus").where({ id: req.params.id }).update({ name });
    res.json({ id: req.params.id, name });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri ažuriranju roda" });
  }
});

// Obriši genus
app.delete("/api/genus/:id", async (req, res) => {
  try {
    await db("genus").where({ id: req.params.id }).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("SQL Greška:", error);
    res.status(500).json({ error: "Greška pri brisanju roda" });
  }
});

module.exports = app;
