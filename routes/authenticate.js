exports.callback = function(req, res){
  res.send(req.user)
}

exports.error = function(req, res){
  res.send('Login Failed')
}
