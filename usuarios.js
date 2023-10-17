const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Historial = require('./historial');


const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 },
});

const Counter = mongoose.model('counter3', counterSchema);

const usuariosSchema = new Schema({
    _id: { type: Number },
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rePassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    deleted: { type: Boolean, default: false },
    viewingHistory: [
        {
            historial: {
                type: Schema.Types.ObjectId,
                ref: 'Historial'
            },
            fecha: {
                type: Date,
                default: Date.now
            }
        }
    ],
},
    { timestamps: true }
);

usuariosSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'usuarioId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            doc._id = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

usuariosSchema.methods.comparePassword = function(password) {
    // Comparar la contraseña ingresada con la contraseña almacenada en el documento
    return password === this.password;
};


const Usuarios = mongoose.model('Usuarios', usuariosSchema, 'usuarios_divadrive');

module.exports = Usuarios;
