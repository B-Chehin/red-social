const validator = require("validator");

const Validate = (params) => {
  let name =
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 3, max: undefined }) &&
    validator.isAlpha(params.name, "es-ES");
  let surname =
    !validator.isEmpty(params.surname) &&
    validator.isLength(params.surname, { min: 3, max: undefined }) &&
    validator.isAlpha(params.surname, "es-ES");
  let nick = validator.isLength(params.nick, { min: 3, max: undefined });
  let email = validator.isEmail(params.email);
  let password = validator.isEmpty(params.password);
  if(params.bio){
    let bio = validator.isLength(params.bio, { min: undefined, max: 250 });

    if(!bio){
      throw new Error("Error en la validacion");
    }
  }

  if (!name || !surname || !nick || !email || !password) {
    throw new Error("Error en la validacion");
  }

  return true;
};

module.exports = {
  Validate,
};
