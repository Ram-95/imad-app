var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

/* Creating the configuration for DB */
var config = {
    host: 'db.imad.hasura-app.io',
    user: 	'ramkottapally',
    port: '5432',
    database: 	'ramkottapally',
    password: process.env.DB_PASSWORD
};

function hash(input, salt) {
  // Make a Hash function
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  // pbkdf2Sync is a hash functin that concatenates input with salt and then hashes the value 10k times
  // password -> password+salt -> <hash> -> <hash>.. 10k times
  return["pbkdf2Sync", "1000", salt, hashed.toString('hex')].join("~");
}

app.get('/hash/:input',function(req, res) {
   var hashString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashString);
});


app.post('/create-user', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result) {
       if(err) {
           res.status(500).send(err.toString());
       } else {
           res.send('User Successfully Created: '+ username);
       }
   });
    
});


app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result) {
       if(err) {
           res.status(500).send(err.toString());
       }  else {
           if(result.rows.length === 0) {
               res.status(403).send('Username/Password is Invalid');
           } else {
               // Match the password
               var dbString = result.rows[0].password;
               var salt = dbString.split('~')[2];
               var hashedPassword = hash(password, salt);
               if(hashedPassword === dbString) {
                   res.send('Credentials Correct!');
               } else {
                   res.status(403).send('Username/Password is Invalid');
               }
           }
       }
    });
});



/* Creating Articles objects to load necessary articles */
// This piece of code is not necessary as we are loading the articles from the DB below. This section can be removed.
var articles = {
    'article-one' : {
        title: 'Article One | Ram Babu',
        heading: 'Article One',
        date: Date(),
        content: `
            <p>
                This is the space for Article ONE.
            </p>
    `
    },
    'article-two' : {
        title: 'Article Two | Ram Babu',
        heading: 'Article Two',
        date: Date(),
        content: `
            <p>
                This is the space for Article TWO.
            </p>
        `
    },
    'article-three' : {
        title: 'Article Three | Ram Babu',
        heading: 'Article Three',
        date: Date(),
        content: `
            <p>
                This is the space for Article THREE.
            </p>
        `
    }
};

/* Function to create the basic html template.. since the html is same for all the three articles! */
function createTemplate(data) {
    var title = data.title;
    var date = data.date.toDateString();
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate= `
        <html>
            <head>
                <title>
                    ${title}
                </title>
                <meta name= "viewport" content= "width=device-width, initial-scale=1" /> <!-- this is for mobile browsers so that they need not zoom out -->
                <link href="/ui/style.css" rel="stylesheet" />
               
            </head>
    
            <body>
                <div class= "container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    
                    <hr/>
                    
                    <h3>
                        ${heading}
                    </h3>
                    
                    <div class= "date">
                        ${date}
                    </div>
                    
                    <div>
                        ${content}
                    </div>
               </div> 
            </body>
        </html>
    
    `;
    return htmlTemplate;
}





/* Calling necessary functions */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



// To Test DB is working or not!
var pool = new Pool(config);
app.get('/test-db', function(req, res) {
   pool.query('SELECT * FROM test', function(err, result) {
       if(err) {
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
   }); 
});


var counter = 0;
app.get('/counter', function(req, res) {
   counter = counter + 1;
   res.send(counter.toString()); 
});


var names = [];
app.get('/submit-name', function(req, res) {
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});


// Fetching Data from DB and rendering in the page
app.get('/articles/:articleName', function (req, res) {
    //articleName == article-one
    //articles[articleName] == content object for article-one
    
    // SELECT * FROM article1 WHERE title = 'article-one'; 
    // user can inject their own sql like this /articles/';DELETE FROM article1 WHERE 'a' = 'a
    // To avoid this, we must use $1 instead of quotes and put the req.params.articleName in an array.
    // This will put a '\' in front of quotes so that SQL statements are considered as strings but not SQL statements
    
    pool.query("SELECT * FROM article1 WHERE title = $1", [req.params.articleName], function(err, result) {
       if(err) {
           res.status(500).send(err.toString());
       } else {
           if(result.rows.length === 0) {
               res.status(404).send('Article Not FOUND!');
           } else {
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
    });
    
    
    /*var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));*/
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(80, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
