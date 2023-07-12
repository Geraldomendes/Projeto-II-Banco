const Event = require ('../models/Event');
const Neo4jController = require('./Neo4jController');

const neo4j = new Neo4jController();

class EventsController{
    async create(req, res){
        const body = req.body;
        if(body.titulo && body.lat && body.lng) {
            try {
                const result = await Event.create(body);
                await neo4j.salvarEvento(result.id);
                res.sendStatus(201)
            } catch (error) {
                res.sendStatus(400);
            }
        }else res.sendStatus(400)
    }
    async read(req, res){
        try {
            const events = await Event.find({},{_id:true, __v:false});
            res.json(events);
        } catch (error) {
            res.sendStatus(404);
        }
    }
    async find(req, res){
        const content = req.params.content;
        try {
            const events = await Event.find(
                { $text: { $search: `%${content}%` } },
                { _id: true, __v: false },
              );
            if(events.length >= 0) res.json(events)
            else res.sendStatus(204);
        } catch (error) {
            res.sendStatus(404);
        }
    }

    async findById(req, res){
        const id = req.params.id;
        try {
            const result = await Event.findById(id);
            if(result) res.json(result);
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }

    async update(req, res){
        const body = req.body;
        const id = req.params.id;
        try {
            const result = await Event.findByIdAndUpdate({_id: id}, {...body});
            if(result) res.sendStatus(200)
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }
    async delete(req, res){
        const id = req.params.id;
        try {
            const result = await Event.findByIdAndDelete({_id: id});
            if(result) res.sendStatus(200)
            else sendStatus(400)
        } catch (error) {
            res.sendStatus(404);
        }
    }
};

module.exports = EventsController;
