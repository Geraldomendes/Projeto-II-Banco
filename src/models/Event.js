const mongoose = require('../../database/database');

const eventSchema = new mongoose.Schema({
    titulo: String,
    dataInicio: { type: Date, default: Date.now },
    dataFim: { type: Date, default: Date.now },
    descricao: String,
    lat: Number,
    lng: Number
  },{collection: 'eventos'});
  
  eventSchema.index({titulo:'text', descricao:'text'},{default_language:'pt', weights:{titulo:2, descricao:1}});
  
  const Event = mongoose.model('Event', eventSchema);

  module.exports = Event;