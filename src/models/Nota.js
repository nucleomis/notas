const mongoose = require("mongoose");
const {Schema} = mongoose; //para que me traiga solo el esquema de la libreria mongoose

//esquema de la tabla Nota
const NoteSchema = new Schema({
    titulo: {type:String, required:true},//atributos de la tabla 
    descripcion: {type: String, required:true},
    fecha: {type: Date, default: Date.now},
    user: {type:String}
});

module.exports = mongoose.model("Nota", NoteSchema);