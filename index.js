const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const fs = require("fs/promises");
// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const DATABASE_FILE = "database.json"
const readDatabase = async() => {
  const rawData = await fs.readFile(DATABASE_FILE);
  return JSON.parse(rawData);
}

app.get("/", (req, res) => {
  res.render("createcard");
});

app.get("/people/:id", async (req, res) => {
  const userId = req.params.id
  const database = await readDatabase()
  const user = database.users.find(user => user.id == userId)
  console.log(user)
  res.render("profile", {user});
});

app.post("/createCard", async (req, res) => {
  const technologyList = ["html", "js", "react"]
  const database = await readDatabase()
  const technologies = []
  for (field in req.body) {
    if (technologyList.includes(field)) {
      technologies.push(req.body[field])
    }
  }

  const newUser = {
    id: database.users.length + 1,
    fullName: req.body.name,
    aboutMe: req.body.aboutMe,
    knownTechnologies: technologies,
    githubUrl: req.body.githubUrl,
    twitterUrl: req.body.twitterUrl,
    favoriteBooks: req.body.books.split(',')
  }
  database.users.push(newUser)

  
  res.render("profile", {user: newUser})
});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
