const express = require('express')
const dittoJSON = require('./pokemon/ditto.json')

const app = express()
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

app.use(express.json())

// Middleware para parsear el body de un request POST con Content-Type: application/json
// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // solo llegan request que son POST y que tienen el header Content-Type: application/json
//   let body = ''

//   // escuchar el evento data
//   req.on('data', chunk => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     data.timestamp = Date.now()
//     // mutar la request y meter la información en el req.body
//     req.body = data
//     next()
//   })
// })

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

app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}`)
  })