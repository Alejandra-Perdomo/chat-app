//to keep track of users

const users = [];

const addUser = ({id, username, room}) =>{
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for existing user 
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error: "Username is in use!"
        }
    }

    //Store user
    const user = {id, username, room};
    users.push(user);
    return {user};
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id //If no match, function returns -1
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    const found_user = users.find((user) => user.id === id);
    return found_user;
}

const getUsersInRoom = (room) =>{  
    const found_users = users.filter((user)=>{
        return user.room === room
    })

    return found_users; 
}

/* addUser({
    id: 22,
    username: "Alejandra",
    room: "room1"
})

addUser({
    id: 23,
    username: "Maria",
    room: "room2"
})

addUser({
    id: 12,
    username: "Daniel",
    room: "room1"
}) */
/* 
console.log(users);

const removedUser = removeUser(22);
console.log(removeUser); */
const users_room1 = getUsersInRoom("room2");
console.log(users_room1);

module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}