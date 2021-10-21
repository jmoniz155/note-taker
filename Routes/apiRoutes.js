const db = require("../db/db");

// This document specifies an Internet standards track protocol for the Internet community, and requests discussion and suggestions for improvements.
// This specification defines a Uniform Resource Name namespace for UUIDs (Universally Unique IDentifier), also known as GUIDs (Globally Unique IDentifier). 
// A UUID is 128 bits long, and can guarantee uniqueness across space and time.
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const fs = require("fs");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// read
function readDB() {
    return readFileAsync("Develop\db\db.json", "utf8")
}

function writeDB(note) {
    // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    return writeFileAsync("Develop\db\db.json", JSON.stringify(note, null, 2))
} 

module.exports = function(app) {

    app.get("/api/notes", function(req, res) {
        readDB().then(notes => res.json(JSON.parse(notes))).catch(err => res.status(500).json(err));
    });
    // req is an object containing information about the HTTP request that raised the event. 
    //In response to req, you use res to send back the desired HTTP response.

    app.post("/api/notes", function(req, res) {
        req.body.id = uuidv4();
        db.push(req.body);
        writeDB(db)
            .then(res.status(200).json("Added a note."))
            .catch(err => res.status(500).json(err));

    });

    app.delete("/api/notes/:id", function(req, res) {
        const deleteID = req.params.id;
        for (let i = 0; i < db.length; i++) {
            let note = db[i];
            if (note.id === deleteID) {
                db.splice(i, 1);
            }
        }
        writeDB(db)
            .then(res.status(200).json("Finished deleting."))
            .catch(err => res.status(500).json(err));
    })

};
