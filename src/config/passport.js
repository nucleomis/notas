const passport = require("passport");//metodo me permite verificar si el usuario existe
//en este caso voy a verificar con passport-loca porque puedo verificar con otras cuentas como github facebook etc
const  localStrategy = require("passport-local").Strategy;

//verifico si existe el usuario con este metodo, controlo la contraseña, el usuario con la base de datos local
const User = require("../models/User");
passport.use(new localStrategy({
    usernameField: "email",

}, async(email, password, done) =>{
   const user =  await User.findOne({email:email});
   if(!user){
       return done(null, false, {message:"No se encontro el usuario"});//callback done sirve para terminar el proceso de autenticacion
   }
   else{
       const coincide = await user.matchPassword(password);

       if(coincide){
           return done(null, user)
       }
       else{
           return done(null, false, {message: "password incorrecto"});
       }
   }
}));

//metodo para almacenar el id del usuario en una sesion
passport.serializeUser((user, done)=>{
    done(null, user.id)
});

//tomo un id y genero un usuario
passport.deserializeUser((id, done)=>{
    User.findById(id, (err,user)=>{
        done(err,user);
    })
});