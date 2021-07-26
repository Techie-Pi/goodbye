const Path = require("path");
const { promisify } = require("util");

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

const api = require("./routes/api");
const { canAccessNote, removeNote } = require("./notes/noteManagement");

app.set("view engine", "handlebars");

app.engine("handlebars", handlebars({
    layoutsDir: Path.resolve("views/layouts")
}));

app.use("/api/v1", api);

app.get("/", (req, res) => {
    res.render("main", { layout: "index" })
})

app.get("/:noteId/:password", async (req, res) => {
    try {
        const { result: canAccess, _note: note } = await canAccessNote({ id: req.params.noteId, password: req.params.password });

        if(!canAccess) { res.status(403).end() }

        await removeNote({ id: req.params.noteId });

        res.render("note", { layout: "index", note })
    }
    catch(e) {
        res.status(500).end();
    }
})

app.listen(process.env.PORT || 8090, () => {
    console.log(`Running on port ${process.env.PORT || 8090}`);
})
