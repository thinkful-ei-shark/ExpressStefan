require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

const data = require('./movieList')

app.use(function validate(req,res,next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
      }
      
      next()
})

app.get('/movie', (req, res) => {
    const genre = req.query.genre
    const country = req.query.country
    const avg_vote = req.query.avg_vote
    let newData = ''

    

    if (avg_vote) {
        newData = data.filter(movie => 
            parseFloat(movie.avg_vote) >= parseFloat(avg_vote)
        )
    }   
    if (country) {
        newData = data.filter(movie =>
            movie.country.toLowerCase() === country.toLocaleLowerCase()
        )
    }
    if (genre) {
        newData = data.filter(movie =>
            movie.genre.toLowerCase() === genre.toLocaleLowerCase()
        )
    }
    
   



    res.json(newData)
})

app.listen(8000, () => {
    console.log('Running on port 8000')
})