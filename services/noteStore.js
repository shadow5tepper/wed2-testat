var Datastore = require("nedb");
var db = new Datastore({
  filename: "./data/notes.db",
  autoload: true,
  timestampData: true,
});

function getAllNotes(sortItem, sortOrd, filter, callback) {
  var query = filter ? { finished: { $exists: !filter } } : {};
  db.find(query)
    .sort({ [sortItem]: sortOrd })
    .exec(function (err, data) {
      callback(err, data);
    });
}

function getNote(id, callback) {
  db.findOne({ _id: id }, callback);
}

function createNote(note, callback) {
  db.insert(note, callback);
}

function editNote(id, note, callback) {
  db.update({ _id: id }, note, callback);
}

module.exports = {
  add: createNote,
  get: getNote,
  all: getAllNotes,
  update: editNote,
};
