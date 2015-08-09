import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;

let app = express();

app.use('/lib', express.static(path.join(__dirname, '..', 'web', 'lib')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
});

app.listen(PORT);

console.log('running on port', PORT);
