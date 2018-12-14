const socket = io('https://video-chat-khactung1610.herokuapp.com/');

//ẩn div-chat
// $('#div-chat').hide();
// $('#btnSignUp').click(()=>{
//     $('div-chat').show();
//     $('div-dang-ki').hide();
// }
socket.on('danh_sach_online', arrUserInfor=>{
    arrUserInfor.forEach(user =>{
        const {name,peerId} = user;
        $('#ulUser').append('<li id="' +peerId+ '">' + name + '<li/>')
    })
    socket.on('co_nguoi_dung_moi', user=>{
        const {name,peerId} = user;
        $('#ulUser').append('<li id="' +peerId+ '">' + name + '<li/>')
    })
    socket.on('ai-do-ngat-ket-noi',peerId =>{
        $("#"+peerId).remove();
    })
})

socket.on('dang_ki_that_bai',()=>{
    alert("Ten da ton tai, moi nhap ten khac =))))");
})

function openStream(){ /*function trả về 1 promise*/
    const config = {audio: true ,video:true};
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));

const peer = new Peer({key:'s0xuhlvq9g2satt9'});
peer.on('open',id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(()=>{
        const username = $('#txtUsername').val();
        socket.emit('nguoi_dung_dang_ki', {name: username, peerId: id});
    })
});

// Caller
$('#btn-call').click(()=>{
    const id = $('#remoteId').val(); //lấy giá trị trong thanh input
    openStream()
        .then(stream =>{
            playStream('localStream',stream);
            const call = peer.call(id,stream);
            call.on('stream', remoteStream => playStream('remoteStream',remoteStream))
        });
});

//Receiver
peer.on('call',call=>{
    openStream()
        .then(stream =>{
            call.answer(stream);
            playStream('localStream',stream);
            call.on('stream', remoteStream => playStream('remoteStream',remoteStream))
        });
})