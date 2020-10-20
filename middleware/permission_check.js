

const UserPathList={
    "1":[{
	              "pathid":24,
	              "path_type":"User account manage",
	               "pathlist":[ "api/admin" ]
              },
              {
	              "pathid":18,
	              "path_type":"Supplier account manage",
	               "pathlist":[ "api/supplier" ]
              },
               {
                "pathid":19,
                "path_type":"Operation user account manage",
                 "pathlist":[ "api/operationUser" ]
              },{
                "pathid":20,
                "path_type":"Territory Officer account manage",
                 "pathlist":[ "api/territoriOfficer" ]
              },{
                "pathid":21,
                "path_type":"Retailer account manage",
                "pathlist":[ "api/retailer" ]
              },{
                "pathid":22,
                "path_type":"Delivery Man account manage",
                "pathlist":[ "api/deliveryman" ]
              }
          ],

    "5":[],

    "6":[],

    "4":[]
}

//dynamic path permission check...middleware..
const PermissionCheck = async (req,res,next)=>{  

	let {permissions=null,user_type} = req.user_info;
	//check is it supper admin or not...
	if(!user_type){next()}
	//or for other users check permission...
   else{
     //check if permission is empty...
     if(!permissions){return res.status(101).json({success:false,message:"You don't have permission for this" })}
     //if permission have then check hitted pathid is exist in user permission array or not...
     else{
     	//convert user permission string to integer array..
       permissions=permissions.split(',').map(Number)

       /*
       //get path name from request..which path is hitted...
       let pathname =`${req.baseUrl}${req.route.path}`.split(':')[0].slice(1) // /api/admin/createNewUser/:id to api/admin/createNewUser/
       pathname = pathname.slice(-1)=='/'?pathname.slice(0,-1):pathname // api/admin/createNewUser/ or api/admin/createNewUser to api/admin/createNewUser
       */

        let pathname =req.baseUrl.slice(1);  

         //find path id from above UserPathList static Object....
	     let pathid=null
		 UserPathList[user_type].some(item=>{ let p=item.pathlist.some(innerItem=>{ return (innerItem == pathname) });p?pathid=item.pathid:false })
	     //if pathid exist and have permission then goto next...
	     if(pathid && permissions.includes(pathid)){next()}
	     //if pathid not exist then retun error message...
	     else{return res.status(101).json({success:false,message:"You don't have permission for this" })}

	     }

   }

}


module.exports={PermissionCheck}