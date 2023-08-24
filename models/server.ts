import express from 'express';
import cors from 'cors';
import * as socketio from 'socket.io';
import { createServer, Server as ServerHttp } from 'http';
import { dbConnection } from '../database/config';
import statusRoutes from '../routes/status';
import authRoutes from '../routes/auth';
import Sockets from './sockets';

import { WebSocketServer } from "ws";

export default class Server {
    app: express.Application;
    port: string;
    paths: any;
    server: ServerHttp;
    wss1: WebSocketServer;
    wss2: WebSocketServer;
    sockets: Sockets;

    constructor() {

        this.app  = express();
        this.port = process.env.PORT || '8080';
        this.server = createServer(this.app);

        this.wss1 = new WebSocketServer({ noServer: true });
        this.wss2 = new WebSocketServer({ noServer: true });
    
        this.sockets = new Sockets( this.wss1, this.wss2 );

        this.paths = {
            auth: '/api/auth',
            status: '/api/status'
        };
    }

    middlewares() {

        //this.app.use(sslRedirect());

        // Desplegar el directorio público
        this.app.use(express.static('public'));
        
        // Indica el tipo de dato que vendrá
        this.app.use(express.json());

        // CORS
        this.app.use( cors({
            origin: process.env.CORS_ORIGIN
            //origin: '*'
        }) );
    }

    routes() {
        this.app.use(this.paths.status, statusRoutes);
        this.app.use(this.paths.auth, authRoutes);
    }

    async connectToDB() {
        await dbConnection();
    }

    execute() {
        // Conectar a base de datos
        this.connectToDB();

        // Inicializar Middlewares
        this.middlewares();

        this.routes();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }
};