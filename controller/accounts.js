const pg = require('../config/database').pg;
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


RetailerTransectionList = async(req,res) =>{
	let user_id = parseInt(req.user_info.user_id);
	let select_entity = `t.transection_id,t.transection_amount,t.transection_date,tt.transection_details,st.status_name`
	let query = `select ${select_entity} from transections as t inner join transection_types as tt on t.transection_type_id = tt.transection_type_id inner join status_types as st on t.transection_status = st.id where t.user_id = ${user_id} order by t.transection_id DESC`;
    pg.query(query).then(async data=>{
       let account_query = `select account_id,balance from accounts where user_id=${user_id}` 
       let account_details = await pg.query(account_query);
       let {account_id,balance} = account_details[0][0];
       //formate date..
       data[0].forEach((item,inde)=>{ 
	 		let x= new Date(data[0][inde].transection_date)
           data[0][inde].transection_date = x.toLocaleDateString(undefined, options)
         } )

       res.json({UserLoginId:user_id,account_id:account_id,balance:balance,RetailerTransectionList:data[0]})

    }).catch(e=>res.json({success:false,message:"Database query execution error",data:{} }) )
}

GetTransectionReport = async(req,res) =>{
	let {StartDate,EndDate} = req.body
	//logic..big value=StartDate && small value=EndDate
    let x=StartDate,y=EndDate;
    if(StartDate>EndDate){StartDate=y;EndDate=x}

	StartDate = StartDate+' 00:00:00'
	EndDate = EndDate+' 00:00:00';console.log(EndDate)
	let select_entity = `us.full_name,t.transection_id,t.transection_amount,t.transection_date,tt.transection_details,st.status_name`
	let query = `select ${select_entity} from transections as t inner join transection_types as tt on t.transection_type_id = tt.transection_type_id inner join status_types as st on t.transection_status = st.id inner join users as us on t.user_id=us.user_id where t.transection_date >= '${StartDate}' and t.transection_date <= '${EndDate}' order by t.transection_id DESC`;

	pg.query(query).then(data=>{
       return res.json({TransectionReport:data[0]})
	}).catch(e=>res.json({success:false,message:"Database query execution error",data:{e:e.parent.routine} }) )
}

module.exports = {RetailerTransectionList,GetTransectionReport}