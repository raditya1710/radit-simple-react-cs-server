// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import Express from 'express';        // call express
import bodyParser from 'body-parser';
import mysql from 'mysql';
import path from 'path';
import { CONFIG_MYSQL } from './config_server';

const app = new Express();                 // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const port = process.env.PORT || 8080;        // set our port

/* Setting Databases */
const connection = mysql.createConnection(CONFIG_MYSQL);

// ROUTES FOR OUR API
// =============================================================================
const router = Express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
    console.log(config_server.CONFIG_MYSQL);
});

// more routes for our API will happen here
router.route('/users')
  .get(function(req, res){
      connection.query('SELECT * from user', function(err, rows){
          if(!err){
              res.json(rows);
          }
      });
  })

  .post(function(req, res){
      var post = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        description: req.body.description
      };
      connection.query('INSERT INTO user SET ?', post, function(err, rows){
        if(!err){
          res.status(201);
          res.json(rows);
        }
      });
  });

router.route('/users/:id')
  .get(function(req, res){
    connection.query('SELECT * from user WHERE id = ?', req.params.id, function(err, result){
        if(!err){
            res.json(result[0]);
        }
    });
  })

  .delete(function(req, res){
    connection.query('DELETE from user WHERE id = ?', req.params.id, function(err, result){
        if(!err){
            res.json(result[0]);
        }
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
