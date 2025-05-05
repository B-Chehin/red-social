// Model
const Publication = require("../models/publication");

// dependencias
const fs = require("fs");
const path = require("path");

// Servicios
const followService = require("../services/followUsersIds");

// Acciones de prueba

const pruebaPublication = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde: controllers/publication.js",
  });
};

// Guardar publicación
const save = async (req, res) => {
  try {
    // Recoger datos del body para guardarlos
    const params = req.body;
    const userIdentity = req.user;

    // Validar datos
    if (!params.text) {
      return res.status(400).send({
        status: "error",
        message: "Error al guardar publicación",
      });
    }

    // Crear y rellenar la publicación
    const publication = new Publication({
      text: params.text,
      user: userIdentity.id,
    });

    // Guardar publicación en la base de datos
    const publicationStored = await publication.save();

    if (!publicationStored) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar publicación",
      });
    }

    // ✅ RESPUESTA EXITOSA
    return res.status(200).send({
      status: "success",
      message: "Publicación guardada con exito",
      publication: publicationStored,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al guardar publicación",
      error,
    });
  }
};

// Sacar una publicacion en concreto
const detail = async (req, res) => {
  try {
    // Recoer id de publicacion de la url
    const publicationId = req.params.id;

    // Find con la condicion del id
    const publicationStored = await Publication.findById(publicationId);

    if (!publicationStored) {
      return res.status(404).send({
        status: "error",
        message: "Publicación no encontrada",
      });
    }
    // Devolver una respuesta
    return res.status(200).send({
      status: "success",
      message: "Publicación obtenida con exito",
      publicationStored,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener publicación",
      error,
    });
  }
};

// Borrar una publicacion
const remove = async (req, res) => {
  try {
    // Obtener id de publicacion
    const publicationId = req.params.id;

    //Busco y elimino la publicacion (Solo puedo eliminar publicaciones que cree yo)
    const publicationRemoved = await Publication.findByIdAndDelete({
      user: req.user.id,
      _id: publicationId,
    });

    if (!publicationRemoved) {
      return res.status(404).send({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    // Devolver una respuesta
    return res.status(200).send({
      status: "success",
      message: "Publicación borrada con éxito",
      publication: publicationRemoved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al borrar publicación",
      error,
    });
  }
};

// Listar las publicaciones de un usuario
const user = async (req, res) => {
  try {
    // Obtener id del usuario
    const userIdentity = req.params.id || req.user.id;

    // Controlar la pagina
    const page = req.params.page || 1;

    // Numero de documentos por pagina
    const itemsPerPage = 5;

    // Find con la condicion del id y paginacion
    const publicationStored = await Publication.find({ user: userIdentity })
      .sort({ created_at: -1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("user", "name surname nick image");

    if (!publicationStored || publicationStored.length == 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay publicaciones para mostrar",
      });
    }

    // Contar documentos
    const totalDocuments = await Publication.countDocuments({
      user: userIdentity,
    });

    // Total de paginas
    let paginasTotales = Math.ceil(totalDocuments / itemsPerPage);

    // Devolver una respuesta

    return res.status(200).send({
      status: "success",
      message: "Publicaciones obtenidas con exito",
      total: totalDocuments,
      pages: paginasTotales,
      page,
      publications: publicationStored,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al listar publicaciones",
      error,
    });
  }
};
// Listar todas las publicaciones de mis seguidos

// Listar publicaciones de un usuario

// Subir ficheros
const upload = async (req, res) => {
  try {
    // Obtener id de publicacion
    const publicationId = req.params.id;

    if (!publicationId) {
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado la publicacion",
      });
    }

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
    if (
      fileExt != "png" &&
      fileExt != "jpg" &&
      fileExt != "jpeg" &&
      fileExt != "gif"
    ) {
      // Ruta fisica del fichero
      const filePath = req.file.path;

      // Borrar archivo
      const fileDeleted = fs.unlinkSync(filePath);

      return res.status(404).send({
        status: "error",
        message: "Formato de archivo no valido",
        fileDeleted,
      });
    }

    // Si es correcta, guardar imagen en bbdd
    const publicationUpdated = await Publication.findByIdAndUpdate(
      { user: req.user.id, _id: publicationId },
      { file: req.file.filename },
      { new: true }
    );
    if (!publicationUpdated) {
      return res.status(500).send({
        status: "error",
        message: "Error al actualizar la publicacion",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Metodo de subir avatar",
      publication: publicationUpdated,
      file: req.file,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al subir avatar",
      error,
    });
  }
};

// Devolver archivos multimedia imagenes
const media = async (req, res) => {
  try {
    // Recoger el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar si existe el archivo
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({
        status: "error",
        message: "No existe la publicacion",
      });
    }

    // Devolver un file
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la publicacion",
      error,
    });
  }
};

const feed = async (req, res) => {
  try {
    // Obtener ID del usuario identificado
    const userIdentity = req.user.id;

    // Obtener número de página y asegurar que sea válido
    let page = parseInt(req.params.page) || 1;
    if (isNaN(page) || page < 1) page = 1;

    const itemsPerPage = 5;

    // Obtener IDs de los usuarios seguidos
    const myFollows = await followService.followUserIds(userIdentity);

    console.log(myFollows.following_clean);

    if (
      !Array.isArray(myFollows.following_clean) ||
      myFollows.following_clean.length === 0
    ) {
      return res.status(404).send({
        status: "error",
        message: "No seguís a ningún usuario todavía",
      });
    }

    // Obtener publicaciones
    const publications = await Publication.find({
      user: { $in: myFollows.following_clean },
    })
      .sort({ created_at: -1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("user", "name surname nick image");

    // Contar total de publicaciones para paginación
    const total = await Publication.countDocuments({
      user: { $in: myFollows.following_clean },
    });

    if (!Array.isArray(publications) || publications.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No hay publicaciones para mostrar",
      });
    }

    // Enviar respuesta
    return res.status(200).send({
      status: "success",
      message: "Feed obtenido correctamente",
      following: myFollows.following_clean,
      total,
      pages: Math.ceil(total / itemsPerPage),
      page,
      publications: publications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "No se han listado las publicaciones del feed",
      error,
    });
  }
};

// Exportar acciones
module.exports = {
  pruebaPublication,
  save,
  detail,
  remove,
  user,
  upload,
  media,
  feed,
};
