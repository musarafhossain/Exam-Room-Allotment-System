import express from 'express';
import { SubjectController } from '../controllers';
import { SubjectValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const SubjectRouter = express.Router();

SubjectRouter.get('/', verifyJwtToken, SubjectController.getSubjects);

SubjectRouter.get('/:id', verifyJwtToken, SubjectController.getSubject);

SubjectRouter.post(
    '/',
    verifyJwtToken,
    validate(SubjectValidator.createSubjectSchema),
    SubjectController.createSubject
);

SubjectRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(SubjectValidator.updateSubjectSchema),
    SubjectController.updateSubject
);

SubjectRouter.delete('/:id', verifyJwtToken, SubjectController.deleteSubject);

SubjectRouter.post(
    "/bulk-delete",
    SubjectController.bulkDeleteSubject
);

export default SubjectRouter;
