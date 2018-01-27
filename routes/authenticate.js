const db = require('../db')
const domain = process.env.DEV_REDIRECT_URL || 'https://stargo.io'

exports.callback = async function(req, res){
  const { accessToken, profile } = req.user
  const { id, username, displayName } = profile
  // Temp user store insert. Needs conditions
  await db.one('INSERT INTO users(id, username, display_name, token) VALUES($1, $2, $3, $4) RETURNING id', [id, username, displayName, accessToken])
    .then(data => console.log(`Successfully created record #${data.id}.`))
    .catch(error => console.log(error));
  // Temp auth solution
  res.redirect(`${ domain }/?access=${ accessToken }&username=${ username }`)
}

exports.error = function(req, res){
  res.redirect(`${ domain }/?error`)
}
