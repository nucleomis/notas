const express = require("express");//archivo donde voy a enlazar mi pagina y ver el formulario
const Nota = require("../models/Nota");//llamo al modelo de notas para la base de datos
const {isAuthenticated} =  require("../helpers/autenticacion");

const router = express.Router();

router.get("/notes/agregar_nota", isAuthenticated,(req, res)=>{
    res.render("notes/nueva_nota");
});

//recibo la peticion de agregar una nueva nota
router.post("/notes/nueva_nota",isAuthenticated, async (req, res)=>{//async indica que van a existir procesos asincronos
    const {titulo, descripcion}=req.body;//obtengo del formulario el titulo y la descripcion del objeto formulario
    const error = [];

    if(!titulo){
        error.push({text: "Por favor ingrese un titulo"});
    }
    if(!descripcion){
        error.push({text: "Por favor ingrese una descripcion"});
    }
    if(error.length>0){
        res.render("notes/nueva_nota",{
            error,
            titulo,
            descripcion,
        })
    }
    else{
       const nueva_nota =  new Nota({titulo, descripcion});
       nueva_nota.user = req.user.id;
       await nueva_nota.save();//guardo la nueva no ta en la base de datos, con await hago que el proceso de guardado lleve un tiempo determinado
       req.flash("success_msg", "nota agregada con exito");//llamo a la variable global con flash
       res.redirect("/notes");
       
    }

    
});
//listo las notas y las envio a /notes
router.get("/notes",isAuthenticated, async (req, res)=>{
    const notas = await (await Nota.find({user: req.user.id}).lean()).reverse();//obtengo la lista de objetos y los ordeno del ultimo al primero para que me muestre primero la ultima nota guardada
    res.render("notes/lista_notas", {notas});
    
});

//editar las notas
router.get("/notes/editar/:id",isAuthenticated, async (req, res)=>{
    const nota =  await Nota.findById(req.params.id).lean();//obtengo el parametro que me pasa desde el url
    res.render("notes/editar", {nota});
});

//recepcion de la nota ya editada
router.post("/notes/editar_nota/:id",isAuthenticated, async (req, res)=>{
    const {titulo, descripcion} = req.body;
    await Nota.findByIdAndUpdate(req.params.id, {titulo, descripcion}).lean();
    req.flash("success_msg", "Nota actualizada correctamente");//envio los mensajes de confirmacion a la vista
    res.redirect("/notes");
});

//borrar notas
router.delete("/notes/borrar/:id",isAuthenticated, async (req, res)=>{
    await Nota.findByIdAndDelete(req.params.id).lean();
    req.flash("success_msg", "Nota borrada correctamente");//envio los mensajes de confirmacion a la vista
    res.redirect("/notes");
});

module.exports = router;