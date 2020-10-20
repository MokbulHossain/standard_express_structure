
module.exports = {

    //200 series

     OK: (payload, message, req)=>{

        return {
            payload: payload || null,
            message: message || req.i18n.__('Ok'),
        };

    },

    //400 series

     BAD_REQUEST: ( message, payload, req) =>{

        return {

            errors: payload || null,
            message: message || req.i18n.__('bad_request'),
        };

    },
    UNAUTHORIZED: ( message, req)=>{

        return {
            message: message || req.i18n.__('unauthorized'),
        };

    },
     NOT_FOUND :(message, req)=>{

        return {
            message: message || req.i18n.__('notfound'),
        };

    },

     UNPROCESSABLE_ENTITY :( message, payload, req)=>{

        return {
            errors: payload || null,
            message: message || req.i18n.__('unprocessable'),
        };

    },

    //500 series

     INTERNAL_SERVER_ERROR :(message, req)=>{

        return {
            message: message || req.i18n.__('internalservererror'),
        };

    },

}