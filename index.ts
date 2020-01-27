import * as express from 'express';

const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(3000, () => {
   console.log('Le serveur est ouvert sur le port 3000 !');
});
