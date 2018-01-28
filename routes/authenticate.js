const db = require('../db')
const domain = process.env.DEV_REDIRECT_URL || 'https://stargo.io'

exports.callback = async function(req, res){
  const { accessToken, profile } = req.user
  const { id, username, displayName } = profile
  // Temp user store insert. Needs conditions
  try {
    const data = await db.one('UPDATE users SET token = $2 WHERE id = $1 RETURNING id',
      [id, accessToken]
    )
    console.log(`Successfully updated record #${data.id}.`)
  } catch(e) {
    const data = await db.one('INSERT INTO users(id, username, display_name, token) VALUES($1, $2, $3, $4) RETURNING id',
      [id, username, displayName, accessToken]
    )
    console.log(`Successfully created record #${data.id}.`)
  }
  
  // Temp auth solution
  res.redirect(`${ domain }/?access=${ accessToken }&username=${ username }`)
}

exports.error = function(req, res){
  res.redirect(`${ domain }/?error`)
}
