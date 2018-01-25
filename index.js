require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express')
const app = express()
const fetch = require('node-fetch')
const http = require('http').Server(app)
const passport = require('passport')
const GithubStrategy = require('passport-github').Strategy
const authenticate = require('./routes/authenticate')

app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({secret: process.env.AUTH_SESSION_SECRET}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://zoneofavoidance.com/authenticate/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, {
    accessToken: accessToken,
    profile: profile
  })
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

async function fetchStars(username, access, page = 1, res = []) {
  let url = `https://api.github.com/users/${username}/starred?access_token=${access}&page=${page}&per_page=100`
  const pageRaw = await fetch(url)
  const pageRes = await pageRaw.json()
  if (pageRes.length === 100) {
    return fetchStars.call(this, username, access, page + 1, res.concat(pageRes))
  }
  return res.concat(pageRes)
}

async function deleteStar(access, repo, owner) {
  let url = `https://api.github.com/user/starred/${owner}/${repo}?access_token=${access}`
  const { status } = await fetch(url, {method: 'DELETE'})
  return status
}

app.get('/authenticate', passport.authenticate('github', { scope: 'gist, repo' }))
app.get('/authenticate/error', authenticate.error)
app.get('/authenticate/callback',
  passport.authenticate('github', {failureRedirect: '/authenticate/error'}),
  authenticate.callback
)

app.get('/stars', async (req, res, next) => {
  const { username, access } = req.query
  const stars = await fetchStars(username, access)
  res.send(stars)
})

app.get('/unstar', async (req, res, next) => {
  const { access, repo, owner } = req.query
  const message = await deleteStar(access, repo, owner)
  res.send(message)
})

let port = process.env.PORT || 8080
http.listen(port, function(){})
