const response = require("../../helper/responses");
const services = require("../services");
const auth_services = require("../../auth services")
const transformers = require("../../transformers")

const register = async (req, res, next) => {
  try {
    const { username, password, email, passwordConfirmation } = req.body;
    if (username?.length < 3)
      return response.failedWithMessage(
        "name is must be more than 3 chars",
        res
      );
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      return response.failedWithMessage("email is invalid", res);

    if (password?.length < 6)
      return response.failedWithMessage("password is invalid", res);

    if (password.localeCompare(passwordConfirmation))
      return response.failedWithMessage("password dose not match !", res);

    const user = await services.createUser({ username, email, password });
    if (!user)
      return response.failedWithMessage("this user already exist !", res);
    return response.successWithMessage("account created successfully", res);
  } catch (err) {
    console.log("ERROR--> ", err);
    return response.serverError(res);
  }
};

const login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    if (!account || !password)
      return response.failedWithMessage(
        "please fill the account and password !",
        res
      );
    const user = await services.findUser({ account, password });
    if (!user)
      return response.failedWithMessage(
        "user not found please create an account",
        res
      );
    if(!auth_services.checkPassword(password, user?.password))  
    return response.failedWithMessage(
        "please check your password",
        res
      );
      const transformeredUser = transformers.userTransformer(user);
    return response.successWithMessage("logged successfully", res, {
        user: transformeredUser,
        token: auth_services.tokenGenerator(transformeredUser)
    });
  } catch (err) {
    console.log("ERROR--> ", err);
    return response.serverError(res);
  }
};

const getInstanceById = async (id, modelName) => {
  const result = {
      success: false,
      instance: null,
      messages: [],
      status: 404
  }
  if (models[modelName]) {
      const _id = +id
      if (typeof _id === 'number' && _id > 0) {
          const instance = await models[modelName].findByPk(_id)
          if (instance) {
              result.status = 200
              result.success = true
              result.instance = instance
          } else {
              result.messages.push(`${modelName} not found`)
          }
      } else {
          result.status = 422
          result.messages.push(`Please provide a valid id`)
      }
      return result
  } else {
      throw new Error('Model not found')
  }
}

const changestatus  = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name } = req.body;
  const item = await getInstanceById(req.params.id);
  if (item.success) {
    await item.instance.update({
      name
    });
    httpResponse.messages.push("status updated successfully");
  } else {
    httpResponse.messages = [...item.messages];
    res.status(item.status);
  }
  return res.send(httpResponse);
};


module.exports = {
  register,
  login,
  changestatus
};
