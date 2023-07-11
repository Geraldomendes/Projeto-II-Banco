const mongoose = require('../../database/database');

const userSchema = new mongoose.Schema(
  {
    usuario: String,
    senha: String,
  },
  { collection: "usuarios" }
);

userSchema.index({ usuario: 1 }, { collation: { locale: 'pt', strength: 2 } });

const User = mongoose.model("User", userSchema);

module.exports = User;
