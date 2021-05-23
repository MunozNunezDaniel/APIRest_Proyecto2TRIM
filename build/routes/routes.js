"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getOrd = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Ordenadores.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getOrdenadores = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Ordenadores.aggregate([
                    {
                        $lookup: {
                            from: 'compradores',
                            localField: '_comprador',
                            foreignField: '_nombre_comprador',
                            as: "_ordenadores_comprador"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getOrdenador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { modelo } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Ordenadores.aggregate([
                    {
                        $lookup: {
                            from: 'compradores',
                            localField: '_comprador',
                            foreignField: '_nombre_comprador',
                            as: "_ordenadores_comprador"
                        }
                    }, {
                        $match: {
                            _modelo: modelo
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postOrdenador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { modelo, fabricante, fecha_montaje, precio_del_pc, cantidad, RAM, tipo, comprador } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _modelo: modelo,
                _fabricante: fabricante,
                _fecha_montaje: fecha_montaje,
                _precio_del_pc: precio_del_pc,
                _cantidad: cantidad,
                _RAM: RAM,
                _tipo: tipo,
                _comprador: comprador
            };
            const oSchema = new schemas_1.Ordenadores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.modificaOrdenador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { modelo } = req.params;
            const { fabricante, fecha_montaje, precio_del_pc, cantidad, RAM, tipo, comprador } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Ordenadores.findOneAndUpdate({ _modelo: modelo }, {
                _fabricante: fabricante,
                _fecha_montaje: fecha_montaje,
                _precio_del_pc: precio_del_pc,
                _cantidad: cantidad,
                _RAM: RAM,
                _tipo: tipo,
                _comprador: comprador
            }, {
                new: true,
                runValidators: true
            })
                //////Añadir mas mensajes de error//////
                .then((doc) => {
                if (doc == null) {
                    console.log('El modelo que desea modificar no existe');
                    res.json({ "Error": "No existe el modelo " + modelo });
                }
                else {
                    console.log('Se ha modificado correctamente el modelo ' + modelo);
                    res.json(doc);
                }
            })
                //////////////////////////////////////////
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this.deleteOrdenador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { modelo } = req.params;
            console.log(modelo);
            yield database_1.db.conectarBD();
            yield schemas_1.Ordenadores.findOneAndDelete({ _modelo: modelo })
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            });
            database_1.db.desconectarBD();
        });
        this.getComprador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            yield database_1.db.conectarBD();
            const x = yield schemas_1.Compradores.find({ _identif: identif });
            yield database_1.db.desconectarBD();
            res.json(x);
        });
        this.getCompradores = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield schemas_1.Compradores.find({});
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postComprador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif, nombre_comprador, presupuesto, n_telefono } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _identif: identif,
                _nombre_comprador: nombre_comprador,
                _presupuesto: presupuesto,
                _n_telefono: n_telefono
            };
            const oSchema = new schemas_1.Compradores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.modificaComprador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            const { nombre_comprador, presupuesto, n_telefono } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Compradores.findOneAndUpdate({ _identif: identif }, {
                _nombre_comprador: nombre_comprador,
                _presupuesto: presupuesto,
                _n_telefono: n_telefono
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                if (doc == null) {
                    console.log('El comprador que desea modificar no existe');
                    res.json({ "Error": "No existe el comprador " + identif });
                }
                else {
                    console.log('Se ha modificado correctamente el comprador ' + identif);
                    res.json(doc);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this.deleteComprador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { identif } = req.params;
            console.log(identif);
            yield database_1.db.conectarBD();
            yield schemas_1.Compradores.findOneAndDelete({ _identif: identif })
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/ordenador', this.getOrd), //Obtiene todos los ordenadores Funciona
            this._router.get('/ordenadores', this.getOrdenadores), //Hace un lookup de ambas colecciones Funciona
            this._router.get('/ordenador/:modelo', this.getOrdenador), //Hace un lookup de ambas colecciones agrupando por modelo Funciona
            this._router.post('/ordenadorN', this.postOrdenador), //Añadir nuevo ordenador Funciona
            this._router.delete('/ordenadorB/:modelo', this.deleteOrdenador), // Funciona
            this._router.post('/ordenadormod/:modelo', this.modificaOrdenador), //Funciona
            this._router.get('/compradores', this.getCompradores), //Obtiene todos los compradores Funciona
            this._router.get('/comprador/:identif', this.getComprador), //Obtiene 1 pedido Funciona
            this._router.post('/compradorN', this.postComprador), //Añadir nuevo pedido Funciona
            this._router.post('/compradormod/:identif', this.modificaComprador), // Funciona
            this._router.delete('/compradorB/:identif', this.deleteComprador); //Funciona
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;