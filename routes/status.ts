import { Router } from 'express';
import { check } from 'express-validator';
import { getStatus, updateStatus } from '../controllers';
import { fieldsValidator } from '../middlewares';
import { notExistsField, notExistsStatus, verifyJWT } from '../helpers';
const router: Router = Router();

router.get(
    '/', 
    verifyJWT,
    getStatus
);

router.put(
    '/:id',
    verifyJWT,
    [
        check('id', 'El ID no es válido').isMongoId(),
        check('field', 'El campo "field" es obligatorio').not().isEmpty(),
        check('status', 'El campo "status" es obligatorio').not().isEmpty(),
        check('field').custom(notExistsField),
        check('status').custom(notExistsStatus),
        fieldsValidator
    ],
    updateStatus
);

export default router;