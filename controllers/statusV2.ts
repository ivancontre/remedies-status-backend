import { NextFunction, Request, Response} from 'express';
import { StatusV2Model, UserModel } from '../models';

export const getStatusV2 = async (req: Request, res: Response) => {
    try {

        const status = await StatusV2Model.find({});
        return res.status(200).json(status);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const updateStatusV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let date = new Date();
        const { id } = req.params;

        const { key, value, close_rest } = req.body;

        const filter = { _id: id, user: req.body.id, };

        let body : any = {};
        body[key] = value;

        if (key === 'enabledAM') body['updatedAtAM'] = date;
        if (key === 'enabledPM') body['updatedAtPM'] = date;

        await StatusV2Model.findOneAndUpdate(filter, body, { new: true });

        if (close_rest) {
            const status = await StatusV2Model.find({_id: {$ne: id}});
            for (const s of status) {
                let body: any = {};

                if (s.enabledAM) {
                    body['enabledAM'] = false;
                    body['updatedAtAM'] = date;
                }

                if (s.enabledPM) {
                    body['enabledPM'] = false;
                    body['updatedAtPM'] = date;
                }
                
                await StatusV2Model.findOneAndUpdate({_id: s._id}, body, { new: true });
            }
        }

        const respoonse = await StatusV2Model.find({ user: req.body.id });   
        
        res.status(200).json(respoonse);

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};