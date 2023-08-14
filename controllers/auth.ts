import { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import { generateJWT } from '../helpers';
import { IUser, UserModel } from '../models';


export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        // Verficar correo existe
        if (!user) {
            return res.status(400).json({
                msg: `Usuario y contraseña no son correctos`
            });
        }

        // Verficar passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: `Usuario y contraseña no son correctos`
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            token,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }
};

export const register = async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body;

        const user: IUser = new UserModel({
            name,
            email,
            password
        });

        // Encriptar password
        const salt: string = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // TODO: Crear registros en status

        return res.status(201).json({
            msg: 'User created',
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Por favor hable con el administrador'
        });
    }   
};

export const renewToken = async (req: Request, res: Response) => {

    const { id, email } = req.body;

    try {

        const user = await UserModel.findById(id);

        
        // Generar nuestro JWT
        const token = await generateJWT(id, email);
        
        return res.json({
            token,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'No fue posible renovar el token'
        });
    }    
};