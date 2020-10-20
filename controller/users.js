const pg = require('../config/database').pg;

GetDriverList = async(req,res) =>{
   let query = `select user_id as "DriverId",image,full_name as "FullName",rating as "Rating",DPT.type 
                as "PickIn" from users as us inner join driver_pick_types as DPT on DPT.id=us.pick_type_id where 
                user_type=2 order by rating DESC`
   pg.query(query).then(data=>{
   	return res.json({DriverList:data[0]})
   })
}

RetailerAccountInfo = async(req,res) =>{
	let user_id = parseInt(req.user_info.user_id);
   let query = `select users.user_id,phone,full_name,image,users.point,address,email,ac.balance,st.status_name as last_order_status from users left join accounts as ac on users.user_id = ac.user_id
               left join orders o on users.user_id = o.user_id left join status_types as st on o.order_status=st.id where o.user_id=${user_id} order by o.order_id DESC limit 1`
   pg.query(query).then(data=>{
   	return res.json({Myinfo:data[0][0]})
   })
}



module.exports = {GetDriverList,RetailerAccountInfo}