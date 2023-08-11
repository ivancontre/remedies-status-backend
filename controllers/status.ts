import { Request, Response} from 'express';
import { StatusModel } from '../models';

export const getStatus = async (req: Request, res: Response) => {
    try {

        const frecuency = await StatusModel.find();

        return res.status(200).json(frecuency);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {

        let date = new Date();
        const { id } = req.params;

        const { field, status } = req.body;

        let cardPayload : any = {};

        if (field === "morning") {
            cardPayload.morning = status;
            cardPayload.updatedat_morning = date;
        } else {
            cardPayload.afternoon = status;
            cardPayload.updatedat_afternoon = date;
        }

        const cardUpdated = await StatusModel.findByIdAndUpdate(id, cardPayload, { new: true });

        return res.status(200).json(cardUpdated);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};