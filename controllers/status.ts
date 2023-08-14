import { Request, Response} from 'express';
import { StatusModel } from '../models';

export const getStatus = async (req: Request, res: Response) => {
    try {

        const status = await StatusModel.find({ user: req.body.id });

        return res.status(200).json(status);

        
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

        const { field, status
         } = req.body;

        let cardPayload : any = {};

        let isOpen = false;

        if (status === "OPEN") {
            isOpen = true;
        }

        if (field === "morning") {

            if (isOpen) {
                cardPayload.morning = status;
                cardPayload.updatedat_morning = date;
                cardPayload.afternoon = "CLOSED";
            } else {
                cardPayload.morning = status;
                cardPayload.updatedat_morning = date;
            }
            
        } else { // afternoon
            if (isOpen) { 
                cardPayload.afternoon = status;
                cardPayload.updatedat_afternoon = date;
                cardPayload.morning = "CLOSED";
            } else {
                cardPayload.afternoon = status;
                cardPayload.updatedat_afternoon = date;
            }
        }

        const filter = { _id: id, user: req.body.id}
        await StatusModel.findOneAndUpdate(filter, cardPayload, { new: true });
        const allStatus = await StatusModel.find({ user: req.body.id });        

        const statusUpdate = allStatus.filter(s => (s.morning === 'OPEN' || s.afternoon === 'OPEN') && s.id !== id);

        for (const day of statusUpdate) {
            if (day.morning === "OPEN") {
                await StatusModel.findByIdAndUpdate(day.id, {
                    morning: "CLOSED"
                }, { new: true });
            } else {
                await StatusModel.findByIdAndUpdate(day.id, {
                    afternoon: "CLOSED"
                }, { new: true });
            }
        }

        const respoonse = await StatusModel.find({ user: req.body.id });   
        
        return res.status(200).json(respoonse);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};