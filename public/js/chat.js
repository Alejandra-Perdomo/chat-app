var socket = io();

/* socket.on('countUpdated', (count)=>{
    console.log('The count has been updated: ', count)
})*/

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');

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

socket.on('message', (msg)=>{
    console.log(msg);
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

