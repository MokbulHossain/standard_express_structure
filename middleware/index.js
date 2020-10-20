
import jwt from 'jsonwebtoken';
import {appkey,moduleKey} from '../config/keys';
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'

module.exports= { 

    localize: (req, res, next) => {

		    let locale =req.acceptsLanguages()[0];
		    locale = locale.includes("-")?locale.slice(0, -3):locale;
		    req.i18n.setLocale(locale);
		    next();

		},

	checkInvalidInput:async (error, req, res, next)=>{
		if(error){
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('invalid_input'), null, req));
		}
		next();
	},

	checkModule:async (req,res,next)=>{
		let Module = req.header("Module"); 
		if (Module != moduleKey){
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('invalid_module'), null, req));
		  }
   
		next();
   },
   checkAuthorizaion:async (req,res,next)=>{
		let authorization = req.header("authorization")
		if(!authorization){ 
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		 }
		authorization = authorization.split(" "); 
		if( authorization[0] != 'Bearer'){  
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		 }
		authorization = authorization[1]; 
		let Module = req.header("Module");
		if (!authorization || Module != moduleKey) {
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		}
		try { 
				let decode = await jwt.verify(authorization, appkey.jwtKye);
				req.user_info = decode;
				next();

		}catch (e) {

			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))

		}
},
	isSupperAdmin: (req,res,next) => {

			const {user_info} = req
		
			   if(user_info.user_type != 0 ){
				 return res.status(401).json({error:"You Have no Permission"})
			   }
			  next();
		
			},
		

/*	isSupplierOrOperationUser: (req,res,next) => {
				 const {user_info} = req; console.log('user_info.user_type ',user_info.user_type)
				   if(user_info.user_type != 5 && user_info.user_type != 6){
					 return res.status(401).json({error:"You Have no Permission"})
				   }
				  next();
		
	},*/

}