//Реализовать чат на основе эхо-сервера wss://echo.websocket.org/
//Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
//При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
//Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:
//обавить в чат механизм отправки гео-локации:
//При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.

const btn1 = document.querySelector('.j-btn-send-message');
const btn2 = document.querySelector('.j-btn-geo');
const resultNode = document.querySelector('.result');
const wsUri = 'wss://echo.websocket.org/';

let websocket;
let result = '';
function connect(){
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        document.querySelector("body").removeChild(document.querySelector('.text_await'));
        document.querySelector("body").insertAdjacentHTML("afterbegin", `<div class="text_done">Все готово</div>`);
        setTimeout(() => document.querySelector("body").removeChild(document.querySelector(".text_done")), 3000);
        btn1.removeAttribute("disabled");
        btn2.removeAttribute("disabled");
    };
    websocket.onclose = function(evt) {
        console.log("DISCONNECTED");
    };
    websocket.onmessage = function(evt) {
        showMessage(
            `${evt.data}`,
        false, true);
    };
    websocket.onerror = function(evt) {
        console.log('ERROR: '+ evt.data);
    };
}

function showMessage (message, user, server){
    if (user){
        result =`<div style="word-wrap: break-word; text-align: left;">${message}</div>`;
    } else if (server){
        result =`<div style="word-wrap: break-word; text-align: right;">${message}</div>`;
    }
    resultNode.insertAdjacentHTML("beforeend",`${result}`);
}

btn1.addEventListener('click',  async () => {
    let userMessage = document.querySelector('.j-input').value;
    showMessage(userMessage,true,false);
    await websocket.send(userMessage);
    document.querySelector('.j-input').value = '';
});

const sucess = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let adress = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Гео-локация</a>`;
    showMessage(adress,true,false);
}
const error = () => {
    showMessage('Невозможно получить ваше местоположение',false, true);
}

btn2.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showMessage('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentPosition(sucess, error);
    }
});

window.addEventListener('unload', function (){
    websocket.close();
    console.log('closed');
});

connect();
