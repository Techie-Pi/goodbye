const { canAccessNote, createNote, removeNote } = require("../notes/noteManagement");

const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
    res.json({
        version: 1,
        status: "OK"
    }).end();
})

router.post("/notes/get/:noteId", async (req, res) => {
    if(req.body.password == null) { res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }

    try {
        const { result: canAccess, _note: note } = await canAccessNote({id: req.params.noteId, password: req.body.password});

        if(!canAccess) { res.status(403).json({ status: 403, message: "Forbidden" }).end(); return; }

        const { title, message, signature, author } = note;

        await removeNote({ id: req.params.noteId });

        res.status(200).json({
            status: 200,
            data: { title, message, signature, author }
        }).end();
    }
    catch(e) {
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        }).end();
    }
})

router.post("/notes/create", async (req, res) => {
    if(req.body.title == null || req.body.message == null || req.body.signature == null || req.body.author == null || req.body.password == null) { res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }

    const { title, message, signature, author, password } = req.body;

    const { id } = await createNote({ title, message, signature, author, password });

    res.status(200).json({
        status: 200,
        data: { id, password }
    }).end();
})

module.exports = router;
