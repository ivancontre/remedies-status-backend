import { Request, Response} from 'express';
import { StatusV2Model } from '../models';

export const getStatusV2 = async (req: Request, res: Response) => {
    try {

        console.log(req.body.id)
        const status = await StatusV2Model.find({});
        console.log(status)
        return res.status(200).json(status);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const updateStatusV2 = async (req: Request, res: Response) => {

};