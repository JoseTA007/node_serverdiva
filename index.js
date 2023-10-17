const express = require('express');
const mongoose = require('mongoose');
const Historial = require('./historial');
const Usuarios = require('./usuarios');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
//mongodb+srv://45600874:Veronic0@cluster0.aswbijj.mongodb.net/flutterproyect
mongoose.connect('mongodb+srv://45600874:Veronic0@cluster0.aswbijj.mongodb.net/flutterproyect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });


// Ruta para agregar un producto
app.post('/api/add_historial', async (req, res) => {
    try {
        const historial = new Historial(req.body);
        const savedHistorial = await historial.save();
        res.status(200).json(savedHistorial);
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
});

// Ruta para obtener todos los productos (excluyendo los eliminados)
app.get('/api/get_historials', async (req, res) => {
    try {
        const historials = await Historial.find({ deleted: false });
        res.status(200).json(historials);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

/* // Ruta para buscar productos por nombre
app.get('/api/search_products', async (req, res) => {
    const nombreProducto = req.query.nombre;

    try {
        const regex = new RegExp(nombreProducto, 'i');
        const productos = await Product.find({ pname: regex, deleted: false });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
}); */
// Ruta para buscar productos por nombre o ID o marcar del producto
app.get('/api/search_historials', async (req, res) => {
    const { search} = req.query;

    try {
        let historials;

        // Verificar si el parámetro de búsqueda es un número (posible ID del producto)
        if (!isNaN(search)) {
            // Búsqueda por ID del producto
            historials = await Historial.find({
                _id: search,
                deleted: false
            });
        }
        /* else if (brand) {
            // Búsqueda por marca del producto
            //console.log('Brand:', req.query.brand);
            products = await Historial.find({
                pbrand: { $regex: new RegExp(brand, 'i') },
                deleted: false
            });
        } */ else {
            // Búsqueda por punto de origen
            historials = await Historial.find({
                porigen: { $regex: search, $options: 'i' },
                deleted: false
            });
        }

        res.status(200).json(historials);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});



// Ruta para actualizar un producto
/* app.patch('/api/update_product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const updatedProduct = await Historial.findByIdAndUpdate(productId, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
}); */

// Ruta para eliminar un producto (soft delete)
/* app.delete('/api/delete_product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Historial.findByIdAndUpdate(productId, { deleted: true }, { new: true });
        res.status(200).json({ status: 'Success', message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
}); */

// Iniciar el servidor
app.listen(2000, '0.0.0.0', () => {
    console.log('Server started on port 2000');
});

//-----------------------------------------------------------------------------------
//      REGISTRO DE USUARIOS
//--------------------------------------------------------------------
app.post('/api/register_usuario', async (req, res) => {
    try {
        const usuario = new Usuarios(req.body);
        const savedUsuario = await usuario.save();
        res.status(200).json(savedUsuario);
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
});

// Ruta para obtener los datos de un cliente por su ID
app.get('/api/usuario/:id', async (req, res) => {
    const usuarioId = req.params.id;
    try {
        const usuario = await Usuarios.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ status: 'Error', message: 'Cliente no encontrado' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

// Ruta para actualizar un CLIENTE
app.patch('/api/update_usuario/:id', async (req, res) => {
    const usuarioIdtId = req.params.id;
    try {
        const updatedUsuario = await Usuarios.findByIdAndUpdate(usuarioIdtId, req.body, { new: true });
        res.status(200).json(updatedUsuario);
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
});

// Ruta para obtener todos los CLIENTES (excluyendo los eliminados)
app.get('/api/get_usuarios', async (req, res) => {
    try {
        const clients = await Usuarios.find({ deleted: false });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});


// Ruta para eliminar un CLIENT (soft delete)
app.delete('/api/delete_usuario/:id', async (req, res) => {
    const usuarioId = req.params.id;
    try {
        const deletedUsuario = await Usuarios.findByIdAndUpdate(usuarioId, { deleted: true }, { new: true });
        res.status(200).json({ status: 'Success', message: 'Client deleted' });
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
});

//
//      LOGIN
//
// Ruta para realizar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscar al cliente por su dirección de correo electrónico
        const usuario = await Usuarios.findOne({ email });

        // Verificar si el cliente existe y si la contraseña es correcta
        if (usuario && usuario.comparePassword(password)) {
            // Inicio de sesión exitoso
            // Obtiene el ID del usuario
            const userId = usuario._id;
            const rol = usuario.rol;
            res.status(200).json({ status: 'Success', message: 'Inicio de sesión exitoso', rol: rol, userId: userId, });

        } else {
            res.status(401).json({ status: 'Error', message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

//
//          RECUPERAR CONTRASEÑA
//
// Ruta para validar email y DNI y obtener el ID del usuario
app.post('/api/validar_credenciales', async (req, res) => {
    const { email, dni } = req.body;

    try {
        // Verificar si existe un usuario con el email y dni proporcionados
        const usuario = await Usuarios.findOne({ email, dni });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Email o DNI incorrectos' });
        }

        // Devolver el ID del usuario
        const userId = usuario._id;

        return res.status(200).json({ userId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Ocurrió un error al validar las credenciales' });
    }
});