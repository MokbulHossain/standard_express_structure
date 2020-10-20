
import express from 'express'
const router = express.Router()

import authentication from '../controller/authentication'


router.use("/api/auth/",authentication);

module.exports = router;