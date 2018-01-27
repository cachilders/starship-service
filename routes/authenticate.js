const domain = process.env.DEV_REDIRECT_URL || 'https://stargo.io'

exports.callback = function(req, res){
  const { accessToken, profile } = req.user
  const { username } = profile
  // This will eventually be generated from the initial request and client independent
  res.redirect(`${ domain }/?access=${ accessToken }&username=${ username }`)
}

exports.error = function(req, res){
  res.redirect(`${ domain }/?error`)
}
