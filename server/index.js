// NOTE: error responses are sent in JSON format as follows:
// res.send({ error: `error message` });

const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Server
app.use(express.static(path.join(__dirname, "build")))
app.get("/forum", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.use("/api/posts", require("./routes/posts"))
app.use("/verifyToken", require("./routes/verifyToken"))
app.use("/login", require("./routes/login"))
app.use("/signup", require("./routes/signup"))

app.get("/api", (req, res) => {
	res.send("<p>API is online</p>")
})

console.log(`PORT: ${process.env.PORT}`)
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
