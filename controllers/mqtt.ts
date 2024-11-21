import { Request, Response } from "express";
import Mqtt from "../models/mqtt";
import { IUser, UserModel } from "../models";

export const handlerMqtt = async (req: Request, res: Response, mqtt: Mqtt) => {

    console.log(req.body.action)
    switch (req.body.action) {
        case "UPDATE_ONE":
            const { 
                id, 
                day,
                key,
                value 
            } = req.body;
    
            const user = await UserModel.findById(id);

            console.log(id, 'esta enviando un mensaje')
    
            const esp32: IUser[] = user?.esp32 as IUser[];
    
            const message = {
                day,
                key,
                value,
            }
    
            for (const e of esp32) {
                const topic = e.toString();
                console.log(id, 'enviando mensaje a', topic)
                mqtt.sendMessage(topic, JSON.stringify(message));
            }
            
            break;
    
        default:
            break;
    }
    
    res.status(200);
};

export const handlerMqttV3 = async (req: Request, res: Response, mqtt: Mqtt) => {

    switch (req.body.action) {
        case "UPDATE_ONE":
            const { 
                id, 
                day,
                key,
                enabled,
                servo,
                led
            } = req.body;
    
            const user = await UserModel.findById(id);

            console.log(id, 'esta enviando un mensaje');    
            
            const message = `esp32=${servo.numberESP32}&pin=${servo.pin}&enabled=${enabled}`;
            console.log(message)
            console.log(id, 'Enviando mensaje a', servo.topic);
            mqtt.sendMessage(servo.topic, message);
            
            break;
    
        default:
            break;
    }
    
    res.status(200);
};