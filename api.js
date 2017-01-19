var express    = require('express');
var app        = express(); 
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); 

var port = process.env.PORT || 8080;

var mongoose   = require('mongoose');
var uri = process.env.MONGOLAB_URI;

mongoose.connect(uri, function (err, res) {
  if (err) { 
    console.log ('Erreur pour se connecter à: ' + uri + '. ' + err);
  } else {
    console.log ('Connexion réussie à la BD' + uri);
  }
});

var Etudiant = require('./models/etudiant');

// --------------------
// ROUTES D'API
// --------------------
var router = express.Router();

// Routeur qui reçoit tous les messages et les route à l'endroit approprié
router.use(function(req, res, next) 
{    next(); // Continue à la route
});


// Route de test, sur /api
router.get('/', function(req, res) {
    res.json({ message: 'Bienvenue sur l\'API de GTI525'});   
});

// --------------------
// ROUTES D'API
// --------------------
router.route('/etudiants')

    //obtenir tous les étudiants
    .get(function(req, res) {
        var Query = Etudiant.find({"nom":1});
        Query.select('-_id');
        Query.exec(function (err, etudiants) {
        if (err) throw err;
            res.send(etudiants);
        });
    });


router.route("/etudiant")
    // Ajouter un étudiant
    .post(function(req, res) {
        
        var etudiant = new Etudiant();   
        etudiant.code = req.body.code;
        etudiant.nom = req.body.nom;
        etudiant.prenom = req.body.prenom;

        // sauvegarde l'étudiant à la BD
        etudiant.save(function(err) {
            if (err){
                res.send(err);
                return;
            }
            res.json({ message: 'Étudiant ajouté' });
        });
        
    });

router.route("/etudiant/:code")  //Prend le code permanent dans l'URL. Ex. /etudiant/BOIE10101010
    //Obtenir un seul étudiant
    .get(function(req, res) {
        Etudiant.find({'code':req.params.code}, function(err, etudiant) {
            if (err){
                res.send(err);
                return;
            }
            res.json(etudiant);
        });
    });

router.route("/etudiant/:id")
    //Modifier le message d'un étudiant
    .put(function(req, res) {
        Etudiant.findById(req.params.id, function(err, etudiant) {

            if (err){
                res.send(err);
                return;
            }
            etudiant.message = req.body.message;

            etudiant.save(function(err) {
                if (err){
                    res.send(err);
                    return;
                }
                res.json({ message: 'Message ajouté!' });
            });
        });
    });

// FIN DES ROUTES

//Enregistre les routes d'API pour qu'elles soient accessibles sur /api
app.use('/api', router);

// Page de présentation des messages
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

// Démarrer le serveur
app.listen(port);
console.log('Serveur démarré sur le port ' + port);
