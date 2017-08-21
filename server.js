var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
  'articleone': { 
      'title': 'Srikanth - Article One',
      'heading': 'My Content For Article 1',
      'Content': 
      `<p> This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First Paragraph This is my First ParagraphThis is my First Paragraph This is my First Paragraph
       </p>`
  }  ,
  'articletwo': { 
      'title': 'Srikanth - Article One',
      'heading': 'My Content For Article 1',
      'Content': 
      `<p> This is my 2nd Paragraph
       </p>` }  ,
  'articlethree': { 
  'title': 'Srikanth - Article Three',
      'heading': 'My Content For Article 3',
      'Content': 
      `<p> This is my 3 Paragraph This is my 3 Paragraph This is my 3 Paragraph
       </p>`}
    
};

function CreateTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    
var htmltemplate
   `<html>
    <head>
        <title>$title</title>  
        <meta name= 'viewport' content = 'width-device-width , initial-scale-1'>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <Body>
        <div class = 'Container'>
            <div>
                <a href ='/'>Home</a>
                
            </div>
            <div>
                 <h1>$heading</h1>
                 <p>$Content</p>
             </div>
        </div>
     </Body>    
 </html>`;
return htmltemplate;

}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/:articleName', function (req, res) {
var articleName = req.params.articleName;
  res.send(CreateTemplate(articles[articleName]));
});

app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'articletwo.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname,'ui', 'articlethree.html'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
