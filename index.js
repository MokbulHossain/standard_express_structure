
require('dotenv').config()
import express from 'express';
import debug from 'debug';
const app = express();
const PORT = process.env.PORT|| 2000;
const [ info, errorLog, debugLog ]= [ debug('info'), debug('warning'), debug('warnning') ];
import {readdir} from 'fs' ;
import cors from 'cors';
import i18n from 'i18n-2';
import morgan from 'morgan';
import {localize,checkAuthorizaion} from './middleware';

app.use(express.json({limit:'1024mb',strict:false}));
app.use (function (error, req, res, next){
    if(error){res.json({error:'Invalid Input'})}
});
app.use(express.urlencoded({limit: '1024mb', extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(cors())

	
//const auth = require("./router/auth")








//app.use("/api/auth",auth);

//token check.....after below all route....
app.use(checkAuthorizaion);


readdir('./routes', (err, files) => {

    files.forEach(file => {

        app.use(`/`, require(`./routes/` + file));

    });

});

// language config

i18n.expressBind(app, {locales: [ 'en' ] })

app.use(localize);


app.listen(PORT, () => {

    info(`🚀 Magic happens at port number ${PORT}`);

});



