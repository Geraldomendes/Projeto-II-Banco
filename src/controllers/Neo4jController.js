const driver = require('../../database/neo4j');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

class Neo4jController {
    async salvarEvento(id){
        const session = driver.session();
        try {
        const result = await session.run("CREATE (:Event{id:$id})", { id });
        console.log(result.summary.counters._stats.nodesCreated);
        session.close();
        } catch (error) {
            console.log(error);
        }
    }

    async salvarUsuario(id){
        const session = driver.session();
        try {
            const result = await session.run("CREATE (:User{id:$id})", { id });
            console.log(result.summary.counters._stats?.nodesCreated);
            await session.close();
        } catch (error) {
            console.log(error);
        }
    }

    async curtirEvento(req, res){
        const session = driver.session();
        try {
          const id = req.params.id;
          const authorization = req.get("authorization");
          const user = await jwt.decode(authorization, process.env.JWT_SECRET);
          if (user) {
              const result = await session.run(
              "MATCH (u:User{id:$idUser}) OPTIONAL MATCH (e:Event{id:$idEvent}) MERGE (u)-[:Subscribed]->(e)",
                  {
                      idUser: user.id,
                      idEvent: id,
                  }
              );
              console.log(result.summary.counters._stats.relationshipsCreated);
          } else return res.sendStatus(404);
          session.close();
          return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }

    async eventosCurtidos(req, res){
        const id = req.params.id;
        const session = driver.session();
        try {
          const result = await session.run(
            "MATCH (e1:Event)<-[:Subscribed]-(u:User)-[s:Subscribed]->(e2:Event) WHERE e1.id = $id RETURN e2.id as events, count(e2) as quantity ORDER BY quantity desc LIMIT 3",
            {
              id: id,
            },
          );
          const events = [];
          await Promise.all(
            result.records.map(async (e) => {
              const event = await Event.findById(e._fields[0]);
              events.push({
                _id: event._id,
                titulo: event.titulo,
                quantity: e._fields[1].low,
              });
            }),
          );
          session.close();
          return res.json(events);
        } catch (error) {
          console.log(error);
          res.sendStatus(500);
        }
    }

    close() {
        driver.close();
    }
}

module.exports = Neo4jController;