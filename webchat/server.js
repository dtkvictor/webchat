const express = require('express')
const app = express()
const port = 8080

app.use(express.static(__dirname + '/dist/'))

app.get('/*', (request, response) => {
    response.sendFile(__dirname + '/dist/index.html')
})

app.listen(port, () => {    
    const listeningOn = require('listening-on')
    listeningOn.print(port)    
})