// Dependencias
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../middlewares/auth");
const multer = require("multer");

// Configuracion de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-"+ file.originalname);
  },
});

const uploads = multer({storage});

// Definir rutas
router.get("/prueba-usuario", checkAuth.auth, UserController.pruebaUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", checkAuth.auth, UserController.profile);
router.get("/list/:page", checkAuth.auth, UserController.list);
router.get("/list", checkAuth.auth, UserController.list);
router.put("/update", checkAuth.auth, UserController.update);   
router.post("/upload", [checkAuth.auth, uploads.single("file0")], UserController.upload);   
router.get("/avatar/:file", UserController.avatar);
router.get("/counters/:id", checkAuth.auth, UserController.counters);


// Exportar router  
module.exports = router;
