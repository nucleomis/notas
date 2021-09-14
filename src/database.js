const mongoose = require('mongoose');
// colocamos la url de conexión local y el nombre de la base de datos
mongoose.connect('mongodb://localhost:27017/note-db-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(db=>console.log("base de datos conectada"))// configuracion para el funcionamiento de la biblioteca
.catch(err =>console.error("error"));
