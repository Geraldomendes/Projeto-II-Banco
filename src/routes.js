const express = require ('express');
const router = express.Router();
const EventsController = require('./controllers/EventsController');
const event = new EventsController();

router.post('/event', event.create);
router.get('/event', event.read);
router.get('/search/:content', event.find);
router.get('/event/:id', event.findById);
router.put('/event/:id', event.update);
router.delete('/event/:id', event.delete);

module.exports = router;