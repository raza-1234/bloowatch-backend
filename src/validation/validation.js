const registerUserValidation = (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  
  if (!(name?.trim() && email?.trim() && password?.trim() && confirmPassword?.trim())){
    res.status(400).json({"message": "All Fields Are Compulsory!!!"})
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
  if (!(email?.trim() && password?.trim())){
    res.status(400).json({"message": "All Fields Are Required"});
    return false;
  }
  return { email, password };
}

const verifyEmailValidation = (req, res) => {
  const  id  = Number(req.params.id);
  const { emailToken } = req.body;
  if (!id){
    res.status(400).json({"message": "Id Is Required In Params."});
    return false;
  }
  if (!emailToken?.trim()){
    res.status(400).json({"message": "Token Is Required."});
    return false
  }
  return { id, emailToken }
}

module.exports = {
  registerUserValidation,
  userAuthorizationValidation,
  verifyEmailValidation
}

