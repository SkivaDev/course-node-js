const express = require('express')
const dittoJSON = require('./pokemon/ditto.json')

const app = express()
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
    console.log('El primer middleware')
    next()
})

app.get('/pokemon/ditto', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(dittoJSON))
})

app.post('/pokemon', (req, res) => {
    let body = ''

    req.on('data', chunk => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const parsedBody = JSON.parse(body)
        console.log(parsedBody)
        res.writeHead(201, {
            'Content-Type': 'application/json; charset=utf-8'
        })
        res.end(JSON.stringify(parsedBody))
    })
})

app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
})