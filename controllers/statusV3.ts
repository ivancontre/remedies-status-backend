import { NextFunction, Request, Response} from 'express';
import { DayTrip, StatusV2Model, StatusV3Model, UserModel } from '../models';
import { ESP32 } from '../models/statusV3';

export const getStatusV3 = async (req: Request, res: Response) => {
    try {
        const status = await StatusV3Model.find({user: req.body.id});
        return res.status(200).json(status);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const updateStatusV3 = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let date = new Date();
        const { id } = req.params;

        const { day_trip, enabled } = req.body;
        const filter = { _id: id, user: req.body.id };

        const update : any = {
            $set: {
                [day_trip+".enabled"]: enabled,
                [day_trip+".updatedAt"]: date
            }
        };

        await StatusV3Model.findOneAndUpdate(filter, update, { new: true });

        const response = await StatusV3Model.find({ user: req.body.id });
        
        res.status(200).json(response);

        const status = response.find(s => s.id === id);

        let servo, led;
        switch (day_trip) {
            case 'morning':
                servo = status?.morning.servo;
                led = status?.morning.led;
                break;
            case 'afternoon':
                servo = status?.afternoon.servo;
                led = status?.afternoon.led;
                break;
            case 'nigth':
                servo = status?.nigth.servo;
                led = status?.nigth.led;
                break;
        }       

        req.body.servo = servo;
        req.body.led = led;

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};