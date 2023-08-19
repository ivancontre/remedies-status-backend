import * as socketio from 'socket.io';
import { checkJWT } from '../helpers';

export default class Sockets {
    io: socketio.Server;

    constructor( io: socketio.Server ) {
        
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {

        this.io.on('connection', async ( socket ) => {

            console.log('cliente conectado')

            const token = socket.handshake.query['x-token'];

            const [valid, id] = checkJWT(token);

            console.log('id', id);

            if (!valid) {
                console.log('socket no identificado');
                return socket.disconnect();
            }

            socket.join(id);

            socket.on('changes', async ({ id }: any) => {                
                socket.broadcast.to(id).emit('load-changes');
            });

            socket.on('disconnect', async (data: any) => {
                console.log('Cliente desconectado...');
            });

        });

    }

}