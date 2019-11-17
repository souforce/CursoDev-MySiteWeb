import uuid from 'uuid/v4';
let users = [
    {
        name: 'System Admin',
        userName: 'admin',
        password: 'password!01',
        email:'admin@website.com',
        sessionId: undefined
    }
]

const authenticateUser = (userName, password) => {
    const currentUser = users.find( user => user.userName === userName && user.password === password);
    
    if(currentUser){
        currentUser.sessionId = uuid();
        users = users.map(user => currentUser.userName === user.userName ? currentUser : user);
        return currentUser;
    }
    return undefined;
}

const registerUser = (user) => {
    const alreadyExist = users.find(u => user.userName === u.userName && user.email === u.email);

    if(alreadyExist){
        return {
            message:`User already exist with user name: ${user.userName} or email ${user.email}`,
            success:'error'
        };
    }

    users = [...users, user];
    return {
        message:`User registered succesfully`,
        success:'success'
    };
}


exports.authenticateUser = authenticateUser;
exports.registerUser = registerUser;
