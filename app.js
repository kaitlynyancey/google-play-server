const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { sort, genres } = req.query;
    if(sort) {
        if (!['Rating','App'].includes(sort)) {
            return res.status(400).send('Sort must be one of Rating or App');
        }
    }
    if(genres) {
        if(!['action','puzzle','strategy','casual','arcade','card'].includes(genres)) {
            return res.status(400).send('Genre must be either Action, Puzzle, Strategy, Casual, Arcade, or Card')
        }
    }
    if (sort) {
        apps
          .sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }

    if(genres) {
        const results = apps.filter(app =>
            app.Genres.toLowerCase().includes(genres.toLowerCase()));
            res.json(results);
    }

    res.json(apps);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});

module.exports = app;