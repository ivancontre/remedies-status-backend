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
                const queryData = url.parse(data.toString(), true).query;

                let message: any = {
                    day: queryData.day
                };

                let isOpen = false;

                if (queryData.status === "OPEN") {
                    isOpen = true;
                }
                if (queryData.field === 'morning') {
                    if (isOpen) {
                        message.morning = 'OPEN';
                        message.afternoon = 'CLOSED';
                    } else {
                        message.morning = 'CLOSED';
                        message.afternoon = 'OPEN';
                    }
                }else {
                    if (isOpen) {
                        message.morning = 'CLOSED';
                        message.afternoon = 'OPEN';
                    } else {
                        message.morning = 'OPEN';
                        message.afternoon = 'CLOSED';
                    }
                }


                const esp32Id = queryData.esp32Id as string;
                console.log(id + ' enviando a ESP32 '+ esp32Id)
                if (users[esp32Id]) {
                    users[esp32Id].send(message);
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