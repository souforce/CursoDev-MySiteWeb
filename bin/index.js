import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import {authenticateUser, registerUser, getUserBySessionId} from './db/user';

const app = express();
app.set('views',path.join(__dirname,'..','views'));
app.engine('html',ejs.renderFile);

app.use('/public',express.static(path.join(__dirname,'..','public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const indexPath = path.join(__dirname,'..','index.html');

app.get('/', (req, res)=>{
    res.render(indexPath,{result:undefined});
});

app.post('/login', (req, res)=>{
         
    const user = authenticateUser(req.body.userName, req.body.password);
    if(user){
        res.set('user-token',user.sessionId);
        if(req.xhr){
            res.status(200)
            .type('json')
            .send(user);
            
        }else{
            res.redirect(302,`/userArea/${user.sessionId}`);
        }

        return;
    }
    res.send('User not found. please check username and password');
});

app.get('/userArea/:sessionId', (req, res) => {
    const user = getUserBySessionId(req.params.sessionId);
    res.render('userArea.html',{user:user});
});

app.post('/signUp', (req, res) =>{
    const newUser = {name:req.body.name, email:req.body.email, userName:req.body.userName, password:req.body.password };
    const result = registerUser(newUser);
    if(req.xhr){
        res.status(200)
           .type('json')
           .send(result);
    }else{
        res.render(indexPath,{result:result});
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