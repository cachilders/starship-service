exports.callback = function(req, res){
  const { accessToken, profile } = req.user
  const { username } = profile
  res.redirect(`https://starship-client.now.sh/?access=${ accessToken }&username=${ username }`)
}

exports.error = function(req, res){
  res.redirect(`https://starship-client.now.sh/?error`)
}
