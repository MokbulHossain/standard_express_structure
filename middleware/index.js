
import jwt from 'jsonwebtoken';
import {appkey,moduleKey} from '../config/keys';


module.exports= { 

    localize: (req, res, next) => {

		    let locale =req.acceptsLanguages()[0];
		    locale = locale.includes("-")?locale.slice(0, -3):locale;
		    req.i18n.setLocale(locale);
		    next();

		},

	checkModule:async (req,res,next)=>{
		let Module = req.header("Module"); 
		if (Module != moduleKey){ return res.status(400).json({success:false,message:"Module is not Match ",data:{} })  }
   
		next();
   },
   checkAuthorizaion:async (req,res,next)=>{
		let authorization = req.header("authorization")
		if(!authorization){ return res.status(400).json({error:"no token provided"}); }
		authorization = authorization.split(" "); 
		if( authorization[0] != 'Bearer'){  return res.status(400).json({error:"Invalid token"}) }
		authorization = authorization[1]; 
		let Module = req.header("Module");
		if (!authorization || Module != moduleKey) return res.status(400).json({error:"Invalid token"});
		try { 
				let decode = await jwt.verify(authorization, appkey.jwtKye);
				req.user_info = decode;
				next();

		}catch (e) {

			return res.status(400).json({error:"Invalid token"})

		}
},
	isSupperAdmin: (req,res,next) => {

			const {user_info} = req
		
			   if(user_info.user_type != 0 ){
				 return res.status(401).json({error:"You Have no Permission"})
			   }
			  next();
		
			},
		
	isSupperAdminOrAdmin: (req,res,next) => { 
		
			const {user_info} = req
			
			   if( user_info.user_type ==0 || user_info.user_type == 1 ){
				 next();
			   }
			   else{
				 return res.status(401).json({error:"You Have no Permission"})
			   }
		
			},
	isDriver: (req,res,next) => {
		
			const {user_info} = req
			
			   if(user_info.user_type != 3 ){
				 return res.status(401).json({error:"You Have no Permission"})
			   }
			  next();
		
			},
		
	isRetailerOrTerritoriOfficer: (req,res,next) => {
		
			const {user_info} = req;
			
			   if(user_info.user_type != 2 && user_info.user_type != 4){
				 return res.status(401).json({error:"You Have no Permission"})
			   }
			  next();
		
			},
		
	isTerritoriOfficer: (req,res,next) => {
				 const {user_info} = req;
			
				   if(user_info.user_type != 4 ){
					 return res.status(401).json({error:"You Have no Permission"})
				   }
				  next();
		
			},
	isSupplierOrOperationUser: (req,res,next) => {
				 const {user_info} = req; console.log('user_info.user_type ',user_info.user_type)
				   if(user_info.user_type != 5 && user_info.user_type != 6){
					 return res.status(401).json({error:"You Have no Permission"})
				   }
				  next();
		
			},

}