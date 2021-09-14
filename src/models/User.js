const mongoose = require("mongoose");
const {Schema} = mongoose; //para que me traiga solo el esquema de la libreria mongoose
const bcryptjs = require("bcryptjs");

//esquema de la tabla Nota
const UserSchema = new Schema({
    nombre: {type:String, required:true},//atributos de la tabla 
    email: {type: String, required:true},
    password: {type: String, required:true},
    fecha: { type: Date, default: Date.now}
});
//cifrado de contraseña con bcryptjs
UserSchema.methods.encrytpPassword = async (password)=>{
    const salt = await bcryptjs.genSalt(10); //me crea un hash aplicando el metodo 10 veces
    const hash = bcryptjs.hash(password, salt);
    return hash;//retorno password encyptado
};

//metodo para usar cuando estoy haciendo login
//comparo la contaseña cifrandola con la que esta cifrada en la base de datos
UserSchema.methods.matchPassword = async function (password){//uso la palabra clave funtion para poder usa this y acceder a los atributos de la clase UserSchema
    return await bcryptjs.compare(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);