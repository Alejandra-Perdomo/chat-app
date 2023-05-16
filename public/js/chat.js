var socket = io();
/* socket.on('countUpdated', (count)=>{
    console.log('The count has been updated: ', count)
})*/

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
//Qs --> query string library
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () =>{
    // New message element
    const $newMessage = $messages.lastElementChild;
    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    console.log(newMessageStyles);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    //visible height
    const visibleHeight = $messages.offsetHeight;
    //Height of messages container
    const containerHeight = $messages.scrollHeight;
    //How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight < scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }

    console.log(newMessageMargin);

}

socket.on('message', (msg)=>{
    // console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (loc_msg)=>{
    console.log(loc_msg);
    const html = Mustache.render(locationTemplate, {
        username: loc_msg.username,
        loc_msg : loc_msg.url,
        createdAt : moment(loc_msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = e.target.elements.message.value;
    if(!message) return;
    $messageFormButton.setAttribute('disabled', 'disabled');
    //disable to avoid accidental double clicks

 
    socket.emit('sendMessage', message, ()=>{
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        console.log('✔️✔️');
    });
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html;
})


$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, ()=>{
            console.log('Location shared ✔️✔️');
            $sendLocationButton.removeAttribute('disabled');
        })
    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error);
        location.href = '/';
    }
})

