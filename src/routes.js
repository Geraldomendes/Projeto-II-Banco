const express = require ('express');
const router = express.Router();
const EventsController = require('./controllers/EventsController');
const UserController = require('./controllers/UserController');
const Neo4jController = require('./controllers/Neo4jController');
const event = new EventsController();
const user = new UserController();
const neo4j = new Neo4jController();

router.post('/event', event.create);
router.get('/event', event.read);
router.get('/search/:content', event.find);
router.get('/event/:id', event.findById);
router.put('/event/:id', event.update);
router.delete('/event/:id', event.delete);

router.post('/signin', user.signin);
router.post('/signup', user.signup);

router.get('/like/:id', neo4j.curtirEvento);
router.get('/liked/:id', neo4j.eventosCurtidos);

module.exports = router;