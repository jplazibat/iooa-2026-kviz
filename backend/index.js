var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const dbConfig = require("./db.config.js");
var mysql = require("mysql");
const cors = require("cors");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
app.use(express.json());
//app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
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
  dbConn.query("SELECT * FROM plant_species where id=?", plant_species_id, (error, results) => {
    if (error) throw error;
    response.send({
      error: false,
      data: results[0],
      message: "plant_species detail.",
    });
  });
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
    }
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
  dbConn.query("SELECT * FROM botanical_family where id=?", botanical_family_id, (error, results) => {
    if (error) throw error;
    response.send({
      error: false,
      data: results[0],
      message: "botanical_family detail.",
    });
  });
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
    }
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
    }
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
      }
    );
  } else if (question_id == 6) {
    dbConn.query("SELECT * FROM useful_part where id=?", plant_species_id, (error, results) => {
      if (error) throw error;
      response.send({
        error: false,
        data: results[0],
        message: "useful_part detail.",
      });
    });
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
    }
  );
});



// Kojoj botaničkoj porodici pripada biljka sa slikom
app.get('/plant_family_question', (req, res) => {
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
      
      dbConn.query(incorrectQuery, [correctFamily], (error, incorrectResults) => {
        if (error) throw error;

        // Kombiniraj točan i netočne odgovore
        const answers = [correctFamily, ...incorrectResults.map(row => row.croatian_name)];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5); // Random odgovor
        
        res.json({
          question: `Kojoj botaničkoj porodici pripada biljka sa slikom?`,
          answers: shuffledAnswers,
          correctAnswer: correctFamily
        });
      });
    } else {
      res.status(404).json({ message: "No plant found with an image." });
    }
  });
});

// dodavanje težine pitanja
app.get('/pitanje/:id', (req, res) => {
  let pitanje_id = req.params.id;
  if (!pitanje_id) {
    return res.status(400).send({
      error: true,
      message: "Please provide pitanje_id",
    });
  }

  dbConn.query("SELECT * FROM pitanja WHERE id=?", pitanje_id, (error, results) => {
    if (error) throw error;
    res.send({
      error: false,
      data: results[0],
      message: "Pitanje detalji.",
    });
  });
});

app.post('/register', (req, res) => {
  console.log('BODY:', req.body);

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password too short' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'Username too short' });
  }

  // EMAIL CHECK
  dbConn.query(
    'SELECT id FROM `user` WHERE email = ?',
    [email],
    async (err, results) => {

      if (err) {
        console.error('SELECT ERROR:', err);
        return res.status(500).json({ message: err.message });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      // USERNAME CHECK
      dbConn.query(
        'SELECT id FROM `user` WHERE username = ?',
        [name],
        async (err, usernameResults) => {

          if (err) {
            console.error('USERNAME CHECK ERROR:', err);
            return res.status(500).json({ message: err.message });
          }

          if (usernameResults.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
          }

          try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const activationHash = crypto.randomBytes(32).toString('hex');

            dbConn.query(
              `INSERT INTO \`user\` (email, password, active, activation_hash, role_id, username)
               VALUES (?, ?, 1, ?, 1, ?)`,
              [email, hashedPassword, activationHash, name],
              (err, result) => {

                if (err) {
                  console.error('INSERT ERROR:', err);
                  return res.status(500).json({ message: err.message });
                }

                return res.status(201).json({
                  message: 'User registered'
                });
              }
            );

          } catch (hashError) {
            console.error('HASH ERROR:', hashError);
            return res.status(500).json({ message: 'Hash error' });
          }
        }
      ); // 👈 zatvoren username query
    }
  ); // 👈 zatvoren email query
}); // 👈 zatvoren route





app.post('/login', (req, res) => {
  console.log('BODY:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // 1. traženje usera po emailu
  dbConn.query(
    'SELECT id, email, password, username, role_id, active FROM `user` WHERE email = ? LIMIT 1',
    [email],
    async (err, results) => {

      if (err) {
        console.error('SELECT ERROR:', err);
        return res.status(500).json({ message: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      const user = results[0];

      // 2. provjera lozinke
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
        }

        // 3.  provjera da li je user aktivan
        if (user.active !== 1) {
          return res.status(403).json({ message: 'Account not active' });
        }

        // 4. login OK → ovdje možeš napraviti JWT ili session
        const token = crypto.randomBytes(32).toString('hex');

        // spremanje session/token u bazu:
        dbConn.query(
          'UPDATE `user` SET refresh_token = ? WHERE id = ?',
          [token, user.id],
          (err2) => {
            if (err2) {
              console.error('TOKEN UPDATE ERROR:', err2);
              return res.status(500).json({ message: err2.message });
            }

            return res.status(200).json({
              message: 'Login successful',
              token,
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role_id: user.role_id
              }
            });
          }
        );

      } catch (compareError) {
        console.error('BCRYPT ERROR:', compareError);
        return res.status(500).json({ message: 'Password check error' });
      }
    }
  );
});
//spremanje rezultata kviza u bazu
app.post('/save-score', (req, res) => {
  const { userId, score } = req.body;

  if (!userId || score == null) {
    return res.status(400).json({ message: 'Missing data' });
  }

  dbConn.query(
    'INSERT INTO rezultati (user_id, rezultat,vrijeme, timestamp) VALUES (?, ?, 30, current_timestamp())',
    [userId, score],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'DB error' });
      }
      console.log('Rezultat pohranjen');
      res.json({ message: 'Rezultat pohranjen' });
    }
  );
});

// dohvat statistike i povijesti rezultata za određenog usera
app.get('/user-stats/:id', (req, res) => {
  const userId = req.params.id;
  const range = req.query.range || 'all';

  let dateFilter = '';

  if (range === 'today') {
    dateFilter = 'AND DATE(timestamp) = CURDATE()';
  }

  if (range === 'week') {
    dateFilter = 'AND YEARWEEK(timestamp, 1) = YEARWEEK(CURDATE(), 1)';
  }

  if (range === 'month') {
    dateFilter = `
      AND MONTH(timestamp) = MONTH(CURDATE())
      AND YEAR(timestamp) = YEAR(CURDATE())
    `;
  }

  const statsQuery = `
    SELECT
      COUNT(*) AS total_games,
      MAX(rezultat) AS best_score,
      AVG(rezultat) AS avg_score,
      SUM(rezultat) AS total_points,
      MAX(timestamp) AS last_played
    FROM rezultati
    WHERE user_id = ?
    ${dateFilter}
  `;

  dbConn.query(statsQuery, [userId], (err, stats) => {
    if (err) return res.status(500).json({ message: err.message });

    const historyQuery = `
      SELECT rezultat, timestamp as created_at
      FROM rezultati
      WHERE user_id = ?
      ${dateFilter}
      ORDER BY timestamp asc
    `;

    dbConn.query(historyQuery, [userId], (err2, history) => {
      if (err2) return res.status(500).json({ message: err2.message });

      res.json({
        stats: stats[0],
        history
      });
    });
  });
});

//spremanje rezultata kviza u bazu
app.post('/save-score', (req, res) => {
  const { userId, score } = req.body;

  if (!userId || score == null) {
    return res.status(400).json({ message: 'Missing data' });
  }

  dbConn.query(
    'INSERT INTO rezultati (user_id, rezultat,vrijeme, timestamp) VALUES (?, ?, 30, current_timestamp())',
    [userId, score],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'DB error' });
      }
      console.log('Rezultat pohranjen');
      res.json({ message: 'Rezultat pohranjen' });
    }
  );
});




app.listen(3000, function () {
  console.log("Node app is running on port 3000");
});

module.exports = app;
