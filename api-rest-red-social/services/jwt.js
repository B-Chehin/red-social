// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_RED_SOCIAL_987987"; 
// Debe ser un string largo y seguro
// a modo de sesion en nuestro proyecto

// Funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //fecha de creacion del payload
        exp: moment().add(30, "days").unix(), // fecha de expiracion del payload
    }   
    // Devolver el jwt token codificado
    return jwt.encode(payload, secret);
}


// Exportar acciones
module.exports = {
    secret,
    createToken
}
