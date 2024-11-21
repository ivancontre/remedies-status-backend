import { Request, Response} from 'express';
import { LaunchModel } from '../models';
import { ObjectId } from "mongodb";

export const getLaunchs = async (req: Request, res: Response) => {
    try {
        const launch = await LaunchModel.find({});
        return res.status(200).json(launch);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const getLaunch = async (req: Request, res: Response) => {
    try {
        const launch = await LaunchModel.findOne({});

        let ruler = '';
        if (launch?.A && launch?.B && launch?.C) {
            ruler = 'launch=TODOS&show=true';            
        } else if (!launch?.A && !launch?.B && !launch?.C) {
            ruler = 'launch=TODOS&show=false';   
        } else if (launch?.A && !launch?.B && !launch?.C) {
            ruler = 'launch=A&show=true';   
        } else if (!launch?.A && launch?.B && !launch?.C) {
            ruler = 'launch=B&show=true';   
        } else {
            ruler = 'launch=C&show=true'; 
        }

        return res.status(200).json([{ruler}]);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const updateLaunch = async (req: Request, res: Response) => {
    try { 
        const { id } = req.params;
        const { launch, show } = req.body;

        let update: any = {};

        if (launch === 'A') {
            update['A'] = show;
            update['B'] = !show;
            update['C'] = !show;
        }

        if (launch === 'B') {
            update['A'] = !show;
            update['B'] = show;
            update['C'] = !show;
        }

        if (launch === 'C') {
            update['A'] = !show;
            update['B'] = !show;
            update['C'] = show;
        }

        if (launch === 'TODOS') {
            update['A'] = show;
            update['B'] = show;
            update['C'] = show;
        }

        await LaunchModel.findOneAndUpdate({_id: new ObjectId(id) }, update, { new: true });
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};