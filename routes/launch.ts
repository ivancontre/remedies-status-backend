import { Router } from 'express';
import { check } from 'express-validator';
import { getLaunch, getLaunchs, updateLaunch } from '../controllers';
import { verifyJWT } from '../helpers';
const router: Router = Router();

router.get(
    '/', 
    verifyJWT,
    getLaunchs
);

router.get(
    '/one', 
    verifyJWT,
    getLaunch
);


router.put(
    '/:id',
    verifyJWT,
    updateLaunch
);

export default router;