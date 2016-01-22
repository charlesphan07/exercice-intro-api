var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EtudiantSchema  = new Schema({
    code: String,
    nom: String,
    prenom: String,
    message: String
});

module.exports = mongoose.model('Etudiant', EtudiantSchema);