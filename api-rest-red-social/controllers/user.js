// Dependencias y modulos
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");
const fs = require("fs");
const path = require("path");


// Importar modelo
const User = require("../models/user");

// Importar servicios
const jwt = require("../services/jwt");
const followService = require("../services/followUsersIds");
const follow = require("../models/follow");

// Acciones de prueba
const counters = async (req, res) => {

  let userIdentity = req.user.id;

  if(req.params.id){
    userIdentity = req.params.id;
  }

  
  try{
    const following = await follow.count({"user": userIdentity});

    const followed = await follow.count({"followed": userIdentity});

    const publications = await Publication.count({"user": userIdentity});

    return res.status(200).send({
      userIdentity,
      following: following,
      followed: followed,
      publications: publications
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener los contadores",
      error,
    });
  }
};



const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde: controllers/user.js",
  });
};

// Registro de usuarios
const register = async (req, res) => {
  try {
    // Recoger datos de la peticion
    const params = req.body;

    // Validar datos
    if (!params.name || !params.email || !params.password || !params.nick) {
      console.log("Faltan datos por enviar");
      return res.status(400).send({
        message: "Faltan datos por enviar",
        status: "error",
      });
    }

    // Verificar usuarios duplicados
    const users = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    });

    if (users && users.length >= 1) {
      console.log("Usuario duplicado");
      return res.status(200).send({
        message: "Usuario ya existe",
        status: "success",
      });
    }

    // Cifrar la contraseña
    const pwd = await bcrypt.hash(params.password, 10);

    // Crear y guardar usuario
    const userToSave = new User({ ...params, password: pwd });
    const userStored = await userToSave.save();

    // Devolver el resultado
    return res.status(200).json({
      status: "success",
      message: "Usuario guardado con exito",
      user: userStored,
    });
  } catch (error) {
    console.log("Error al registrar usuario", error);
    return res.status(500).send({
      message: "Error al registrar usuario",
      status: "error",
    });
  }
};

const login = async (req, res) => {
  try {
    // Recoger parametros del body
    let params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).send({
        message: "Faltan datos por enviar",
        status: "error",
      });
    }

    // Buscar en la bbdd si existe
    const user = await User.findOne({ email: params.email.toLowerCase() });

    if (!user) {
      return res.status(404).send({
        message: "No existe el usuario",
        status: "error",
      });
    }

    // Comprobar su contraseña
    const pwd = bcrypt.compareSync(params.password, user.password);

    if (!pwd) {
      return res.status(400).send({
        message: "Contraseña incorrecta",
        status: "error",
      });
    }

    // Generar Token
    const token = jwt.createToken(user);

    // Devolver Datos del usuario
    return res.status(200).json({
      status: "success",
      message: "Login correcto",
      user: {
        id: user._id,
        name: user.name,
        nick: user.nick,
      },
      token,
    });
  } catch (error) {
    console.log("Error al hacer login", error);
    return res.status(500).send({
      message: "Error al hacer login",
      status: "error",
    });
  }
};

// Devolver la informacion del usuario
const profile = async (req, res) => {
  try {
    // Recogo el id del usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    const user = await User.findById(id)
      .select({ password: 0, role: 0 })
      .exec();

    // Comprobar si existe el usuario
    if (!user) {
      return res.status(404).send({
        message: "No existe el usuario",
        status: "error",
      });
    }

    // Info de seguimiento
    const followInfo = await followService.followThisUser(req.user.id, id);


    // Devolver el resultado
    return res.status(200).json({
      status: "success",
      message: "Perfil obtenido con exito",
      user,
      following: followInfo.following,
      followers: followInfo.followers
    });
  } catch (error) {
    console.log(error, "Error al obbtener el perfil del usuario");
    return res.status(500).send({
      message: "Error al obbtener el perfil del usuario",
      status: "error",
    });
  }
};

const list = async (req, res) => {
  try {
    let page = parseInt(req.params.page) || 1;
    if (isNaN(page) || page < 1) page = 1;

    const itemsPerPage = 5;

    const result = await User.paginate({}, {
      page,
      limit: itemsPerPage,
      sort: { _id: 1 },
      select: "-password -role -__v -email"  // Ocultar campos sensibles
    });

    const followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      page,
      itemsPerPage,
      total: result.totalDocs,
      users: result.docs,
      pages: result.totalPages,
      user_following: followUserIds.following_clean,
      user_followers: followUserIds.followers_clean
    });

  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener los usuarios",
      error
    });
  }
};



const update = async (req, res) => {
  try {
    // Recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    const users = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick.toLowerCase() },
      ],
    });
    console.log(users);
    let userIsset = false;

    users.forEach(user => {
      if(user && user._id != userIdentity.id) userIsset = true;
    }); 
    if(userIsset){
      return res.status(200).send({
        status: 'success',
        message: 'el usuario ya existe',
      });
    }

    // Cifrar la contraseña
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }else{
      delete userToUpdate.password;
    }

    // Buscar y actualizar
    const userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
    
    if(!userUpdated){
      return res.status(500).send({
        status: 'error',
        message: 'error al actualizar el usuario',
      });
    }

    return res.status(200).send({
      status: 'success',
      message: 'Metodo de actualizar usuario',
      userUpdated
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar el usuario",
      error,
    });
  }
};

const upload = async (req, res) => {
  try {
    // Recoger el ficheo de imagen y comprobar que existe
    if (!req.file) {
      return res.status(404).send({
        status: "error",
        message: "No se ha subido ninguna imagen",
      });
    } 
    
    // Conseguir el nombre del archivo
    const image = req.file.originalname;

    // Sacar la extension del archivo
    const fileExt = image.split(".").pop();

    // Comprobar extension
    if (fileExt != "png" && fileExt != "jpg" && fileExt != "jpeg" && fileExt != "gif") {
      // Ruta fisica del fichero
      const filePath = req.file.path;

      // Borrar archivo
      const fileDeleted = fs.unlinkSync(filePath);
      
      return res.status(404).send({
        status: "error",
        message: "Formato de archivo no valido",
        fileDeleted
      });
    }

    // Si es correcta, guardar imagen en bbdd
    const user = await User.findByIdAndUpdate(req.user.id, { image: req.file.filename }, { new: true });
    if(!user){
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar el usuario",
      });
    }


    return res.status(200).send({
      status: "success",
      message: "Metodo de subir avatar",
      user,
      file: req.file,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al subir avatar",
      error,
    });
  }
}

const avatar = async (req, res) => {
  try {
    // Recoger el parametro de la url
    const file = req.params.file;
        
    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/"+file;

    // Comprobar si existe el archivo
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({
        status: "error",
        message: "No existe el avatar",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener avatar",
      error,
    });
  }
}


// Exportar acciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload, 
  avatar,
  counters,
};
