import express from 'express';
import { PaperController } from '../controllers';
import { PaperValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const PaperRouter = express.Router();

PaperRouter.get('/', verifyJwtToken, PaperController.getPapers);

PaperRouter.get('/:id', verifyJwtToken, PaperController.getPaper);

PaperRouter.post(
    '/',
    verifyJwtToken,
    validate(PaperValidator.createPaperSchema),
    PaperController.createPaper
);

PaperRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(PaperValidator.updatePaperSchema),
    PaperController.updatePaper
);

PaperRouter.delete('/:id', verifyJwtToken, PaperController.deletePaper);

PaperRouter.post(
    "/bulk-delete",
    verifyJwtToken,
    PaperController.bulkDeletePaper
);

export default PaperRouter;
