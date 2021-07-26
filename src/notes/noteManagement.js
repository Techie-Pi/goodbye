const bcrypt = require("bcrypt");

const { firestore } = require("../firebase");

async function getNote({ id }) {
    const noteReference = await firestore.collection("notes").doc(id).get();
    const _id = noteReference.id;

    const { title, message, signature, author, passwordHash } = noteReference.data();

    return { _id, title, message, signature, author, passwordHash };
}

async function createNote({ title, message, signature, author, password }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const _noteReference = await firestore.collection("notes").add({
        title, message, signature, author, passwordHash: hash
    });

    const noteReference = await _noteReference.get();

    return { id: noteReference.id };
}

async function removeNote({ id }) {
    await firestore.collection("notes").doc(id).delete();
}

async function canAccessNote({ id, password }) {
    const note = await getNote({ id });
    const canAccess = await bcrypt.compare(password, note.passwordHash);

    return { result: canAccess, _note: note };
}

module.exports = { getNote, createNote, removeNote, canAccessNote };
