// Dependencias
const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication");
const multer = require("multer");
// Autenticacion
const auth = require("../middlewares/auth");

// Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-"+ file.originalname);
  },
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-publicacion", PublicationController.pruebaPublication);
router.post("/save", auth.auth, PublicationController.save);
router.get("/detail/:id", PublicationController.detail);
router.delete("/remove/:id", auth.auth, PublicationController.remove);
router.get("/user/:id/:page", auth.auth, PublicationController.user);
router.post("/upload/:id", [auth.auth, uploads.single("file0")], PublicationController.upload);
router.get("/media/:file", PublicationController.media);
router.get("/feed/:page", auth.auth, PublicationController.feed);

// Exportar router 
module.exports = router;