import * as socketio from 'socket.io';
import { checkJWT } from '../helpers';

import { WebSocketServer } from "ws";

export default class Sockets {
    wss1: WebSocketServer;
    wss2: WebSocketServer;

    constructor( wss1: WebSocketServer, wss2: WebSocketServer ) {        
        this.wss1 = wss1;
        this.wss2 = wss2;
        this.socketEvents();
    }

    socketEvents() {

        this.wss1.on("connection", function connection(socket) {
            console.log("wss1:: User connected");
        });

        
        this.wss2.on("connection", function connection(socket) {
            console.log("wss2:: User connected");
        });
    }

}