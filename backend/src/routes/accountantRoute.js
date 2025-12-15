import express from 'express';
import { authorize, verifyJWT } from '../middlewares/authMiddleware.js';
import {
    getInvoices,
    createInvoice,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    confirmInvoicePayment
} from '../controllers/managerController.js';

const router = express.Router();

router.use(verifyJWT, authorize('accountant'));

router.get('/invoices', getInvoices);

router.post('/invoices', createInvoice);

router.get('/invoices/:id', getInvoiceById);

router.patch('/invoices/:id', updateInvoice);

router.delete('/invoices/:id', deleteInvoice);

router.patch('/invoices/:id/confirm', confirmInvoicePayment);

export default router;