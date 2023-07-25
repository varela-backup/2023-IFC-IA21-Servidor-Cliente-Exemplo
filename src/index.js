const crypto = require("crypto")
const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/../public'))
app.use(express.json())

const loginTokens = []

// VERIFICAR LOGIN
function login(req, res, next) {
  const { token } = req.query
  if (loginTokens.includes(token)) {
    next()
    return
  }
  res.status(400).json({ error: true, msg: "token de acesso inválido!" })
}

// LOGIN
app.get("/login", (req, res) => {
  const { login, senha } = req.query
  if (login == "daniel" && senha == "123123") {
    const hash = crypto.randomBytes(20).toString('hex')
    loginTokens.push(hash)
    console.log(hash)
    res.json({ error: false, token: hash })
    return
  }
  res.status(400).json({ error: true, msg: "usuário e senha inválidos" })
})


// CREATE
app.post("/movies", login, async (req, res) => {
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`, [title, source, description, thumb])
  res.json(result)
})

// READ
app.get("/movies", login, async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  if (id) {
    const result = await db.all(`SELECT * FROM movies WHERE id=?`, id)
    res.json(result)
    return
  }
  const result = await db.all(`SELECT * FROM movies ORDER BY id DESC`)
  res.json(result)
})

// READ
app.get("/movies/:id", login, async (req, res) => {
  const { id } = req.params
  const db = await getDatabaseInstance()
  const result = await db.get(`SELECT * FROM movies WHERE id=?`, id)
  res.json(result)
  return
})

// UPDATE
app.put("/movies", login, async (req, res) => {
  const { id } = req.query
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const result = await db.run(
    `UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`,
    title, source, description, thumb, id
  )
  res.json(result)
})

// UPDATE
app.patch("/movies", login, async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  // const sets = Object.keys(req.body).join("=?, ") + "=?"
  const sets = Object.keys(req.body).map(k => `${k}=?`).join(", ")
  const values = [...Object.values(req.body), id]
  const result = await db.run(`UPDATE movies SET ${sets} WHERE id=?`, values)
  res.json(result)
})

// DELETE
app.delete("/movies", login, async (req, res) => {
  const { id } = req.query
  const db = await getDatabaseInstance()
  const result = await db.run(`DELETE FROM movies WHERE id=?`, id)
  res.json(result)
})

app.listen(3000, () => console.log("Servidor rodando!"))