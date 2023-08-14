import { Router } from 'express';
import { check } from 'express-validator';
import { login, register, renewToken } from '../controllers';
import { fieldsValidator } from '../middlewares';
import { existsEmail, verifyJWT } from '../helpers';
const router: Router = Router();


router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    login
);

router.post(
    '/register',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('email').custom(existsEmail),
        check('password', 'El campo "password" debe de ser al menos de 6 caracteres').isLength({ min: 6 }),
        fieldsValidator
    ],
    register
);

router.get(
    '/renew-token', 
    verifyJWT,
    renewToken
);


export default router;