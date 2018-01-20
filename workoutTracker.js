
/*
Aaron Peressini
6/11/2017
CS 290
 */

var express = require('express');
var mysql = require('./dbcon2.js');

var app = express();
/*var server = app.listen(5100, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port);

});*/
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var cors = require('cors');
app.use(cors());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
//app.set('port', 6100);
var port = Number(process.env.PORT || 8000);
app.use(express.static('assets'));
var server = app.listen(port, function() {
	console.log('Listening on port ' + server.address().port);
});
/*app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});*/


app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
    "date DATE," +
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.port = port;
      res.render('home',context);
    });
  });
 
 /* var context = {};
  mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //context.results = rows;
    res.render('home', context);
  });  */ 
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO todo (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    //console.log("Inserted");
    //context.results = result.insertId;
    //console.log(context.results); 
   // res.send(context.results.toString()); 
   mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      //res.type('text/plain');
      //context.results = rows; 
      res.json(rows);
   });

  });

 
});

app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    //console.log("hello");
    res.json(context.results);
  });
});


///safe-update?id=1&name=The+Task&done=false
app.get('/safe-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM todo WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, 
        req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        //context.results = "Updated " + result.changedRows + " rows.";
       // res.render('home',context);
        mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            //res.type('text/plain');
            context.results = rows;
            //console.log(context.results);    
            res.json(rows);
        });
      });
    }
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
    var createString = "CREATE TABLE todo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
    "date DATE," +
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + port + '; press Ctrl-C to terminate.');
});
