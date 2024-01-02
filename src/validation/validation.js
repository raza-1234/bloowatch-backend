const registerUserValidation = (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  
  if (!(name && email && password && confirmPassword)){
    res.status(400).json({"message": "All Fields Are Compulsory!!!"})
    return false;
  }
  else if (!(name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0 && confirmPassword.trim().length > 0)){
    res.status(400).json({"message": "Fields Can not Be Empty!!!"});
    return false;
  }
  else if (password !== confirmPassword){
    res.status(400).json({"message": "Password And Confirm Password Should Be Same!!!"});
    return false;
  }
  return { name, email, password }
}

const userAuthorizationValidation = (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)){
    res.status(400).json({"message": "All Fields Are Required"});
    return false;
  }
  else if (email.trim().length === 0 || password.trim().length === 0){
    res.status(400).json({"message": "Fields Can Not Be Empty."});
    return false;
  }
  return { email, password };
}

const verifyEmailValidation = (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  if (id.trim().length === 0 || isNaN(id)){
    res.status(400).json({"message": "Id Is Required In Params."});
    return false;
  }
  if (!token || token.trim().length === 0){
    res.status(400).json({"message": "Token Is Required."});
    return false
  }
  return { id, token }
}

module.exports = {
  registerUserValidation,
  userAuthorizationValidation,
  verifyEmailValidation
}

