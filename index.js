const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const { create } = require("domain");

const app = express();
const port = 5000

app.use(express.static(path.join(__dirname, "static")))

app.use(express.urlencoded({ extended: true }))

nunjucks.configure(path.join(__dirname, "templates"), {
    autoescape: true,
    express: app,
})

app.get("/", (req, res) => {
    res.render("index.njk", { posts: posts })
})

app.get("/create", (req, res) => {
    res.render("create_post.njk")
})

let posts = [{
    id: 0,
    title: "Заглушка",
    content: "Это заглушка",
    createdAt: new Date()
}]

app.post("/create-post", (req, res) => {
    const { title, content } = req.body

    const errors = []
    if (!title || title.trim() === "") {
        errors.push({ msg: "Заголовок пустой" })
    }
    if (!content || content.trim() === "") {
        errors.push({ msg: "Содержание пустое" })
    }

    if (errors.length > 0) {
        return res.status(400).render("create_post.njk", {
            errors: errors,
            oldInput: { title, content }
        })
    }

    const newPost = {
        id: posts.length,
        title: title,
        content: content,
        createdAt: new Date()
    }

    posts.push(newPost)
    
    res.redirect("/")
})

app.get("/post/:postID", (req, res) => {
    res.render("post.njk", {post: posts[req.params["postID"]]})
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})