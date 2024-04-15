const http = require('node:http')

// commonJS -> modulos clásicos de node
const dittoJSON = require('./pokemon/ditto.json')

const processRequest = (req, res) => {
    const { method, url } = req

    switch (method) {
        case 'GET':
            switch (url) {
                case '/pokemon/ditto':
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    return res.end(JSON.stringify(dittoJSON))
                default: 
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                    return res.end('<h1>404 Not Found</h1>')
            }
        case 'POST':
            switch (url) {
                case '/pokemon':
                    let body = ''

                    // escuchar el evento data
                    req.on('data', chunk => {
                        body += chunk.toString()
                    })
                    req.on('end', () => {
                        const parsedBody = JSON.parse(body)
                        console.log(parsedBody)
                        res.writeHead(201, {
                            'Content-Type': 'application/json; charset=utf-8'
                        })
                        return res.end(JSON.stringify(parsedBody))
                    })
                    break

                default:
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                    return res.end('<h1>404 Not Found</h1>')
            
            }
        }
}

const server = http.createServer(processRequest)

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})