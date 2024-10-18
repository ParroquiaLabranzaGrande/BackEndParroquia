const mongoose = require('mongoose')



const URI = "mongodb+srv://labranzagrandeparroquia:xpI174XEGbaaModa@labranzagrande.aesdq.mongodb.net/?retryWrites=true&w=majority&appName=Labranzagrande"


mongoose.set('strictQuery')

mongoose.connect(URI)
  .then(() => console.log('Connect Successfully...'))
  .catch(err => console.log(err))

module.exports = mongoose 