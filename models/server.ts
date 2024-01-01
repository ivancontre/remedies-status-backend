import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createServer, Server as ServerHttp } from 'http';
import { dbConnection } from '../database/config';
import statusRoutes from '../routes/status';
import statusV2Routes from '../routes/statusV2';
import authRoutes from '../routes/auth';
import Mqtt from './mqqt';

export default class Server {
    app: express.Application;
    port: string;
    paths: any;
    server: ServerHttp;
    mqtt: Mqtt;

    constructor() {

        this.app  = express();
        this.port = process.env.PORT || '8080';
        this.server = createServer(this.app);

        this.mqtt = new Mqtt();
        this.mqtt.connect();

        this.paths = {
            auth: '/api/auth',
            status: '/api/status',
            statusV2: '/api/v2/status'
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
        this.app.use(this.paths.statusV2, statusV2Routes, async (req: Request, res: Response) => {

            if (req.body.key) {
                let { id, day, key, value } = req.body;

                let message = {
                    id,
                    day,
                    key,
                    value,
                };

                this.mqtt.sendMessage(JSON.stringify(message));
                res.status(200);
            }
            
        });
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