import express from 'express'
import {pg} from '../config/database'
import jwt from 'jsonwebtoken';
import {checkAuthorizaion} from '../middleware';
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'

const router = express.Router()

router.post('login',async(req,res)=>{

    try{



    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
 })

 router.post('logout',checkAuthorizaion,async(req,res)=>{

    try{
       
        let authorization = req.header("authorization")
        await jwt.destroy(authorization[1])
        return  res.status(200).send(OK(null, null,req))

    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
 })

 router.post('forget_password',async(req,res)=>{

    try{



    }catch(e){
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
 })

module.exports = router;