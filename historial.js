const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 },
});

const Counter = mongoose.model('counter', counterSchema);

const historialSchema = new Schema(
    {
        _id: { type: Number },
        porigen: { type: String, required: true},
        pllegada: { type: String, required: true},
        costo: { type: String, required: true},
        calificacion: { type: String, required: true},
        deleted: { type: Boolean, default: false },
    },
    { collection: 'diva_drive' }
);

historialSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc._id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'historialId' },
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

// Restringir las consultas para excluir los productos eliminados
historialSchema.pre(/^find/, function (next) {
    // Incluye esta línea para mostrar todos los productos, incluyendo los eliminados
    this.find();

    next();
});

const Historial = mongoose.model('Historial', historialSchema);

module.exports = Historial;
