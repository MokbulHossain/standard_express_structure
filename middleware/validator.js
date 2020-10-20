var password_Validator = require('password-validator');
const pg = require('../config/database').pg;

module.exports = {

    PasswordValidator: async(password) => { 
    	 //for password validation with table password_configuration....
       
        var special_format = /[!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]/;
       
        var schema = new password_Validator();var passerror=null
         let isspecialcharecter = special_format.test(password)//true or false

        let passwordConfiger = await pg.query(`select * from password_configuration limit 1`);
        let{length,islowercase,isuppercase,isnumber,is_special_charecter} = passwordConfiger[0][0]
       
        let customeMessage = {
          "min":`password length must be ${length} or more`,
          "lowercase":`password contain lowercase charecter `,
          "uppercase":`password contain uppercase charecter `,
          "digits":`password contain digits `,
          "isspecialcharecter":'password must have contain special charecter'
        }

       length?(schema.is().min(length)):null
       islowercase?(schema.has().lowercase()):null
       isuppercase?(schema.has().uppercase()):null
       isnumber?(schema.has().digits()):null

       passerror = schema.validate(password, { list: true })

      if(passerror.length){  return customeMessage[passerror[0]] }
        else{
          passerror = is_special_charecter? !isspecialcharecter?customeMessage.isspecialcharecter :false :false
          return passerror
        }

    },
}