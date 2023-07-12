const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Neo4jController = require('./Neo4jController');

const neo4j = new Neo4jController();

class UserController {
    async signup(req, res){
        const { usuario, senha } = req.body;
        const usuarioCheck = await User.findOne({ usuario }).collation({
            locale: "pt",
            strength: 2,
        });
        if(usuarioCheck){
            return res.sendStatus(409)
        } 
        const hash = await bcrypt.hash(senha, 10);
        const novoUsuario = {
            usuario: usuario,
            senha: hash,
        };
        try {
            const result = await User.create(novoUsuario);
            await neo4j.salvarUsuario(result.id);
            return res.sendStatus(201);
        } catch (error) {
            return res.sendStatus(500);
        }
        
    }

    async signin(req, res){
        const { usuario, senha } = req.body;
        const usuarioCheck = await User.findOne({ usuario }).collation({
            locale: "pt",
            strength: 2,
        });
        if(!usuarioCheck){
            return res.sendStatus(404);
        } else {
            try {
                const check = bcrypt.compare(senha, usuarioCheck.senha);
                if(check){
                    const token = jwt.sign({
                        id: usuarioCheck.id, 
                        usuario: usuarioCheck.usuario}, 
                        process.env.JWT_SECRET, 
                        {expiresIn: 3600}
                    );
                    return res.json({token: `Bearer ${token}`});
                } else return res.sendStatus(401);
            } catch (error) {
                return res.sendStatus(500);
            }
        }
    }
}

module.exports = UserController;