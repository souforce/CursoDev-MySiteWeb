import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import {authenticateUser, registerUser} from './db/user';

const app = express();
app.set('views',path.join(__dirname,'..','views'));
app.engine('html',ejs.renderFile);

app.use('/public',express.static(path.join(__dirname,'..','public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const indexPath = path.join(__dirname,'..','index.html');

app.get('/', (req, res)=>{
    res.render(indexPath);
});

app.post('/login', (req, res)=>{
         
    const user = authenticateUser(req.body.userName, req.body.password);
    if(user){
        res.set('user-token',user.sessionId);
        res.render('userArea.html',{user:user});
        return;
    }
    res.send('User not found. please check username and password');
});

app.post('/signUp', (req, res) =>{
    const result = registerUser(req.body.newUser);
    if(req.xhr){
        res.json(res);
        res.end();
    }else{
        res.render(indexPath,res);
    }
});

app.get('/signUp',(req, res) => {
    res.render('signUp.html');
});

app.listen(process.env.PORT || '3000', () => {
    console.log(`
        Local server running at: http://localhost:3000;
    `);
});