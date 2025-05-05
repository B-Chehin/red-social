// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const { secret } = require("../services/jwt");

// MIDLEWARE de autenticacion
exports.auth = (req, res, next) => {
  // Comprobar si me llega la cabecera de autenticacion
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "No hay cabecera de autenticacion",
    });
  }

  // Limpiar token
  let token = req.headers.authorization.replace(/['"]+/g, "");

  // Decodificar token
  try {
    let payload = jwt.decode(token, secret);
  
    // Comprobar expiracion del token
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: "error",
        message: "Token expirado",
      });
    }

    // Agregar datos de usuario a la request
    req.user = payload;

    // Pasar a la ejecucion de la accion
    next();
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Token no valido",
      error,
    });
  }
};
