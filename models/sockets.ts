import * as socketio from 'socket.io';
import { checkJWT } from '../helpers';

import { WebSocketServer } from "ws";

export default class Sockets {
    wss1: WebSocketServer;

    constructor( wss1: WebSocketServer ) {        
        this.wss1 = wss1;
        this.socketEvents();
    }

    socketEvents() {
        this.wss1.on("connection", function connection(socket) {
            console.log("wss1:: User connected");

            
        });

        this.wss1.on('message', function message(data) {
            console.log('received: %s', data);
          });

        this.wss1.on('error', console.error);
    }

}