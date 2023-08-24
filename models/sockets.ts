import { checkJWT } from '../helpers';
import url from 'url'

import { WebSocketServer, WebSocket } from "ws";

export default class Sockets {
    wss: WebSocketServer;

    constructor( wss: WebSocketServer ) {        
        this.wss = wss;
        this.socketEvents();
    }

    socketEvents() {
        const wss = this.wss;

        let users: any = {};


        this.wss.on("connection", function connection(socket, request) {
            

            const queryData = url.parse(request.url || '', true).query;

            let token: string = queryData['x-token'] as string;

            const [valid, id] = checkJWT(token);

            console.log("wss:: User " + id + " connected");

            if (valid) {
                users[id] = socket;
            }

            socket.on('message', function message(data) {
                const esp32Id = data.toString().replace('CALL_API=', '');
                console.log(id + ' enviando a ESP32 '+ esp32Id)
                if (users[esp32Id]) {
                    users[esp32Id].send('CALL_API');
                } else {
                    console.log('ESP32 '+ esp32Id + ' no conectado');
                }
            });

            socket.on('close', () => {
                console.log('Client disconnected');
                delete users[id];
            });
        });

        

        this.wss.on('error', console.error);
    }

}