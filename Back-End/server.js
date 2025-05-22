const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')
const app = express()
const PORT = 3000
const ADMIN_EMAIL = 'gema.gremio@gmail.com'
const upload = multer({ dest: 'uploads/' })

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

let noticias = []

fs.readFile('./noticias.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao carregar arquivo de notícias:', err)
    } else {
        noticias = JSON.parse(data)
    }
})

app.post('/login', (req, res) => {
    const { email } = req.body
    if (email === ADMIN_EMAIL) {
        res.json({ success: true })
    } else {
        res.status(401).json({ success: false, message: 'Não autorizado' })
    }
})

app.get('/noticias', (req, res) => {
    res.json(noticias)
})

app.post('/noticias', upload.single('imagem'), (req, res) => {
    const novaNoticia = req.body
    novaNoticia.id = noticias.length ? Math.max(...noticias.map(n => n.id)) + 1 : 1
    if (req.file) {
        novaNoticia.imagem = req.file.path
    }
    noticias.push(novaNoticia)
    fs.writeFileSync('./noticias.json', JSON.stringify(noticias, null, 2))
    res.json({ success: true, noticia: novaNoticia })
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

//escrevendo aqui apenas para ver se há delay na digitação