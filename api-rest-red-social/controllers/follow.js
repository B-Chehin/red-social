// Importar modelo
const Follow = require("../models/follow");

// Importar servicio
const followService = require("../services/followUsersIds");

// Importar dependencias
const mongoosePaginate = require("mongoose-paginate-v2");

// Acciones de prueba
const pruebaFollow = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde: controllers/follow.js",
  });
};

// Accion de guardar un follow (accion de seguir)
const save = async (req, res) => {
  try {
    // Conseguir datos por body
    const params = req.body;

    // Sacar id del usuario idefntificado
    const userIdentity = req.user;

    // Cear objeto con modelo follow
    let userToFollow = new Follow({
      user: userIdentity.id,
      followed: params.followed,
    });

    // Comprobar si el usuario ya sigue al otro
    const follow = await Follow.findOne({
      user: userIdentity.id,
      followed: params.followed,
    });

    if (follow) {
      return res.status(200).send({
        status: "success",
        message: "Ya sigues a este usuario",
        follow,
      });
    }

    // Guardar objeto en la bbdd
    const followStored = await userToFollow.save();

    if (!followStored) {
      return res.status(500).send({
        status: "error",
        message: "Error al guardar follow",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Metodo de guardar follow",
      follow: followStored,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al guardar follow",
      error,
    });
  }
};

// Accion de borrar un follow (accion dejar de seguir)
const unFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const followedId = req.params.id;

    const followDeleted = await Follow.findOneAndDelete({
      user: userId,
      followed: followedId,
    });

    if (!followDeleted) {
      return res.status(404).send({
        status: "error",
        message: "No seguías a este usuario",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "Dejaste de seguir a este usuario",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al dejar de seguir",
      error,
    });
  }
};

// Accion listado de ususarios que estoy siguiendo (siguiendo)
const following = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;

    const options = {
      page,
      limit: itemsPerPage,
      populate: {
        path: "followed user",
        select: "-password -role -__v -email",
      },
    };

    Follow.paginate({ user: userId }, options, async (err, result) => {
      if (err || !result) {
        return res.status(500).send({
          status: "error",
          message: "Error al obtener los usuarios",
          error: err,
        });
      }

      // Sacara un array de los usuarios que me siguen y los qu sigo como
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "success",
        message: "Listado de usuarios que sigues",
        follows: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
        following: followUserIds.following_clean,
        followers: followUserIds.followers_clean,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el listado",
      error,
    });
  }
};

// Accion listado de usuarios que me siguen (seguidores)
const followers = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;

    const options = {
      page,
      limit: itemsPerPage,
      populate: {
        path: "user",
        select: "-password -role -__v -email"
      }
    };

    const result = await Follow.paginate({ followed: userId }, options);

    const followUserIds = await followService.followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Listado de usuarios que me siguen",
      follows: result.docs,
      total: result.totalDocs,
      pages: result.totalPages,
      user_following: followUserIds.following_clean,
      user_followers: followUserIds.followers_clean
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el listado",
      error
    });
  }
};


// Exportar acciones
module.exports = {
  pruebaFollow,
  save,
  unFollow,
  following,
  followers,
};
