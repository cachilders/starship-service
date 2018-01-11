require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const fetch = require('node-fetch')
const http = require('http').Server(app)

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

async function fetchStars(username, page = 1, res = []) {
  let url = `https://api.github.com/users/${username}/starred?page=${page}&per_page=100`
  const pageRaw = await fetch(url)
  const pageRes = await pageRaw.json()
  if (pageRes.length === 100) {
    return fetchStars.call(this, username, page + 1, res.concat(pageRes))
  }
  return res.concat(pageRes)
}

app.get('/stars', async (req, res, next) => {
  const { username } = req.query
  const stars = await fetchStars(username)
  res.send(stars)
})

let port = process.env.PORT || 8080
http.listen(port, function(){})
