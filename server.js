var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var config = {
    user: 'sriekanth91',
    database: 'sriekanth91',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
}

var articles = {
  'articleone': { 
      title: 'Srikanth - Article One',
      heading: 'My Content For Article 1',
      Content: 
      `<p> This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First ParagraphThis is my First Paragraph This is my First Paragraph
       </p>`
  }  ,
  'articletwo': { 
      title: 'Srikanth - Article One',
      heading: 'My Content For Article 1',
      Content: 
      `<p> This is my 2nd Paragraph
       </p>` }  ,
  'articlethree': { 
  title: 'Srikanth - Article Three',
      heading: 'My Content For Article 3',
      Content: 
      `<p> This is my 3 Paragraph This is my 3 Paragraph This is my 3 Paragraph
       </p>`}
    
};

function CreateTemplate(data){
     title = data.title;
     heading = data.heading;
     content = data.content;
     date = data.date;
    
var htmltemplate =`
   <html>
    <head>
        <title>
        ${title}
        </title>  
        <meta name= 'viewport' content = 'width-device-width , initial-scale-1'>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <Body>
        <div class = 'Container'>
            <div>
                <a href ='/'>Home</a>
                
            </div>
            <div>
            <h4>${date.toDateString()}</h4>
            </div>
            <div>
                 <h1>${heading}</h1>
                 <p>${content}</p>
             </div>
        </div>
     </Body>    
 </html>`;
return htmltemplate;

}

var counter = 0;
app.get('/counter',function(req,res){
   counter = counter + 1;
   res.send(counter.toString());
});


var names = [];
app.get('/submit-name',function(req,res){
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});
var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('Select * from article',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
    });
});

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
    
}

app.get('/hash/:input',function(req,res){
   var harshedString = hash(req.params.input,'this-is-a-random-string');
   res.send(harshedString);
});

app.post('/create-user',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('Insert into "user"(username,password) values($1,$2)',[username,dbString],function(err,result){
   
   if(err){
       res.status(500).send(err.toString());
   } else{
         res.send('User successfully created: ', username);
       }
       
   });
});

app.post('/login', function(req,res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * from "user" where username = $1',[username],function(err,result){
       if(err) {
       res.status(500).send(err.toString());
   } else {
       if (result.rows.length ===0) {
           res.send('Username / password is invalid');
       } else {
           var dbString = result.rows[0].password;
           var salt = dbString.split('$')[2];
           var hashedPassword = hash(password,salt);
           if (hashedPassword === dbString){
               
               req.session.auth = {userId: result.rows[0].id};
               
               res.send('Credentials are correct');
               
            } else {
               res.send('Invalid credentials');
           }
       }
   }
   });
});

app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in: ' + req.session.auth.userId.toString());
   } else{
       res.send('You are not logged in');
   }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/articles/:articleName', function (req, res) {

pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){
   if(err){
       res.status(500).send(err.toString());
   } else{
       if(result.rows.length === 0){
           res.status(404).send('Article Not Founc');
       }else{
           var articleData = result.rows[0];
           res.send(CreateTemplate(articleData));
       }
   }
});
  
});

app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'articletwo.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'articlethree.html'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'main.js'));
});



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
