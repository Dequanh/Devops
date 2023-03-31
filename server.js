const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors());
app.use(express.static(`${__dirname}/public`))

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '51fe4450d988411ca9773e54b979a09a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})



const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info('HTML served succesfuly')
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info('someone got the list of students to load')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
            rollbar.info('student added succesfully', {author: 'Myron', type: 'manual enrty'})
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
            rollbar.error('no name provided')
           res.status(400).send('You must enter a name.')
       } else {
            rollbar.error('student already exists')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

app.use(rollbar.errorHandler());
const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
