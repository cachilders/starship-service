exports.callback = function(req, res){
  const { accessToken, profile } = req.user
  const { username } = profile
  res.redirect(`http://localhost:3000/?access=${ accessToken }&username=${ username }`)
}

exports.error = function(req, res){
  res.redirect(`http://localhost:3000/?error`)
}
