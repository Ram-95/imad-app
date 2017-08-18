var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));



/* Creating Articles objects to load necessary articles */
var articles = {
    articleOne : {
        title: 'Article One | Ram Babu',
        heading: 'Article One',
        date: 'August 18th 2017',
        content: `
            <p>
                This is the space for Article ONE.
            </p>
    `
    },
    articleTwo : {
        title: 'Article Two | Ram Babu',
        heading: 'Article Two',
        date: 'August 18th 2017',
        content: `
            <p>
                This is the space for Article TWO.
            </p>
        `
    },
    articleThree : {
        title: 'Article Three | Ram Babu',
        heading: 'Article Three',
        date: 'August 18th 2017',
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
    var date = data.date;
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
                    
                    <div>
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

app.get('/article-one', function (req, res) {
  res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
  res.send(createTemplate(articleTwo));
});

app.get('/article-three', function (req, res) {
  res.send(createTemplate(articleThree));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(80, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
