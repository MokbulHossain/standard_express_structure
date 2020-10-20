const pg = require('../config/database').pg;

DriverAssign = async(req,res) =>{
	let {OrderId,DriverId} = req.body
	let user_id = parseInt(req.user_info.user_id);

	//here please implement the logic..if already assign and try again for assign what will do..!!
	let query = `insert into delivery(order_id,user_id,assign_by_id,assign_date,delivery_status) values(${parseInt(OrderId)},${parseInt(DriverId)},${user_id},now(),8)`
	pg.query(query).then(async data=>{
		let order_status_query = `update orders set order_status=8,actionby_id=${user_id},update_date=now() where order_id=${parseInt(OrderId)}`
              await pg.query(order_status_query)
		return res.json({success:true,message:"Sucessfully Assign A Driver",data:{} })
	})
}

module.exports ={DriverAssign}