import express from 'express';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'my_strong_password_you_will_never_find_you_vilains',
  database : 'express_fil_rouge'
});

connection.connect(err => {
  if(err){
    console.log('Error : ', err);
  } else {
    console.log('Connecté');
  }
});

const router = express.Router();

router.get('/', (req, res) => {
  connection.query('SELECT * FROM final_fantasy_games', (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/name', (req, res) => {
  connection.query('SELECT name FROM final_fantasy_games', (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/image', (req, res) => {
  connection.query('SELECT image FROM final_fantasy_games', (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/note/:note', (req, res) => {
  connection.query(`SELECT * FROM final_fantasy_games WHERE note = ${req.params.note}`, (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/find/:name', (req, res) => {
  connection.query(`SELECT * FROM final_fantasy_games WHERE name LIKE '${req.params.name}%'`, (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/search/:date', (req, res) => {
  connection.query('SELECT * FROM final_fantasy_games WHERE `release` > ?', req.params.date, (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.get('/order', (req, res) => {
  const type = req.query.type;
  const sql = (type === 'desc') ?
  'SELECT * FROM final_fantasy_games ORDER BY id DESC' :
  'SELECT * FROM final_fantasy_games ORDER BY id ASC';
  connection.query(sql, (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  })
});

router.post('/games', (req, res) => {
  const formData = req.body;

  connection.query('INSERT INTO final_fantasy_games SET ?',formData,  (err, result) => {
    if(err) {
      console.log('Erreur : ', err);
      res.status(500).send('Erreur lors de l\'ajout...');
    } else {  
      res.sendStatus(200);
    }
  })
});

router.put('/games/:id', (req, res) => {

  const formData = req.body;
  const idMovie = req.params.id;

  connection.query('UPDATE final_fantasy_games SET ? WHERE id=?', [formData, idMovie], err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un jeu");
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/games/pc/:id', (req, res) => {
  const gameId = req.params.id;

  connection.query('UPDATE final_fantasy_games SET `pc-compatibility` = 1 ^ `pc-compatibility` WHERE id = ?', gameId, err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/games/:id', (req, res) => {

  const gameId = req.params.id;

  connection.query('DELETE FROM final_fantasy_games WHERE id = ?', gameId, err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un jeu");
    } else {

      res.sendStatus(200);
    }
  });
});

router.delete('/games/notpc', (req, res) => {

  connection.query('DELETE FROM final_fantasy_games WHERE `pc-compatibility` = 0', err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un jeu");
    } else {

      res.sendStatus(200);
    }
  });
});

export default router;
