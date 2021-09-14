//rutas para las vistas de usuarios como el login y para la logout

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/users/signin", (req, res)=>{
    res.render("users/ingresar");//ruta para el handlebar de ingreso
});

router.post("/users/signin",passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true,
}));

router.get("/users/signup", (req, res)=>{
    res.render("users/registrar");//ruta para el hbs de registro
});

router.post("/users/signup", async (req, res)=>{
    const {nombre, email,password, confirm_password} = req.body;
    const errors = [];
    if(nombre.length == 0){
        errors.push({text:"Ingrese un nombre por favor"});
    }
    if(email.length == 0){
        errors.push({text:"Ingrese un email"});
    }
    if(password != confirm_password){
        errors.push({text:"Las contraseñas no coinciden"});
    }
    if(password.length<4){
        errors.push({text:"ERROR la contraseña debe ser mayor a 4 caracteres"});
    }
    if(errors.length>0){
        res.render("users/registrar", {errors, nombre, email, password, confirm_password});
    }
    else{
        const userEmail = await User.findOne({email:email});
        if(userEmail){
            errors.push({text:"El email ya se encuentra registrado"})
            res.render("users/registrar", {errors});
        }
        if(!userEmail){
            const usuario = new User({nombre, email,password});
            usuario.password = await usuario.encrytpPassword(password);
            await usuario.save();
            errors.push({text:"usuario registrado con exito"})
            res.render("users/ingresar", {errors});
        }
    }
    
});

router.get("/users/logout", (req, res)=>{
    req.logOut();
    res.redirect("/");//ruta para el hbs de registro
});
module.exports = router;