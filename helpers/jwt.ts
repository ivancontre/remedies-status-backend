import { sign, JwtPayload, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response} from 'express';
import { UserModel } from '../models';

export const generateJWT = (id: string, name: string): Promise<string | undefined> => {

    return new Promise((resolve, reject) => {

        const payload = {
            id,
            name
        };

        sign(payload, process.env.SECRET_JWT_SEED as string, {
        }, (error, token) => {
            
            if (error) {
                console.log(error);
                reject('No se pudo generar el token');
            }

            resolve(token);
        });
        
    });
};

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {

    // x-token viene en el header

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const payload: JwtPayload = verify(token, process.env.SECRET_JWT_SEED as string) as JwtPayload;
        
        // console.log(payload)
        const { id, name } = payload;

        const userAuthtenticated = await UserModel.findById(id);

        if (!userAuthtenticated) {
            return res.status(401).json({
                msg: 'Token inválido - user not exists'
            });
        }

        // esto se pasará por next a la siguiente funcion
        const user = userAuthtenticated;
        req.body.name = name;   
        req.body.id = id;   
        req.body.email = user ? user.email : undefined;

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token inválido'
        });
    }

};

export const checkJWT = (token: string) => {
    try {

        const payload: JwtPayload = verify(token, process.env.SECRET_JWT_SEED as string) as JwtPayload;
        
        // console.log(payload)
        const { id } = payload;

        return [true, id];
        
    } catch (error) {
        return [false, null];
    }
}