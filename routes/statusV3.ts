import { Router } from 'express';
import { check } from 'express-validator';
import { getStatusV2, updateStatusV2, getStatusV3, updateStatusV3 } from '../controllers';
import { fieldsValidator } from '../middlewares';
import { notExistsField, notExistsStatus, verifyJWT } from '../helpers';
const router: Router = Router();

router.get(
    '/', 
    verifyJWT,
    getStatusV3
);

router.put(
    '/:id',
    verifyJWT,
    [
        check('id', 'El ID no es válido').isMongoId(),
        fieldsValidator
    ],
    updateStatusV3
);

export default router;