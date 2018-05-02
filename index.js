const board = document.getElementById('board');
const editableBoard = document.getElementById('editable-board');
const trashBin = document.getElementById('trash-bin');
const formholderBackground = document.getElementById('formholderbackground');
const formholder = document.getElementById('formholder');
const formholderFrontend = document.getElementById('frontend');
const formholderSecret = document.getElementById('secret');
const containerFloating = document.getElementById('container-floating');

const backendUrl = 'http://150.165.85.16:9900/';

let frontend = '';
let secret = '';

const colors = [ '#00FFFF', '#00CED1', '#40E0D0', '#48D1CC', '#20B2AA', '#008B8B', '#008B8B', '#7FFFD4', '#66CDAA', '#5F9EA0' ];

function beginBoardLoad() {
  fetch(backendUrl + 'api/msgs').then(function (response) {
    return response.json();
  }).then(function (msgs) {
    endLoadBoard(msgs);
  });
}

function endLoadBoard(msgs) {
  msgs.sort(function (left, right) {
    return moment(left.created_at).diff(moment(right.created_at));
  });

  msgs.forEach(addMessage);
}

function addMessage(msg) {
  if (msg.color === undefined) {
    msg.color = colors[Math.floor(Math.random() * colors.length)];
  }

  board.innerHTML = `<div id="msg_${msg.id}" class="message"` + (msg.frontend === frontend ? `ondragstart="beginDrag(event)" draggable="true" ondragend="onDragEnd(event)"` : ``) + ` style="background-color: ${msg.color}">
    <h4 align="left" class="text-capitalize">${msg.title}</h4>
    <p align="left" class="font-weight-light">${msg.msg}</p>
    <p align="left" class="who">${msg.author}, há ${moment(msg.created_at).fromNow()}</p>
  </div>` + board.innerHTML;
}

function addMessageForm() {
  let color = colors[Math.floor(Math.random() * colors.length)];
  editableBoard.innerHTML = `<div class="editable-message" style="background-color: ${color}">
    <h4 id="editable-title" contenteditable="true" align="left" class="text-capitalize">Título</h4>
    <p id="editable-msg" contenteditable="true" align="left" class="font-weight-light">Mensagem</p>
    <p id="editable-author" contenteditable="true" align="left" class="who">Autor</p>
    <p><button type="button" class="btn btn-primary" onClick="beginSubmit()">Postar</button>
    <button type="button" class="btn btn-danger" onClick="discart()">Descartar</button></p>
  </div>`;

  editableBoard.getElementsByClassName('editable-message')[0].color = color;

  window.scrollTo(0, 0);
}

function beginSubmit() {
  let color = editableBoard.getElementsByClassName('editable-message')[0].color;
  let title = document.getElementById('editable-title').innerText;
  let msg = document.getElementById('editable-msg').innerText;
  let author = document.getElementById('editable-author').innerText;

  fetch(backendUrl + 'api/msgs', {
    method: 'POST',
    body: JSON.stringify({
      title: title,
      msg: msg,
      author: author,
      credentials: frontend + ':' + secret
    })
  }).then(response => response.json()).then(function (response) {
    editableBoard.innerHTML = '';
    response.color = color;
    addMessage(response);
  });
}

function discart() {
  editableBoard.innerHTML = '';
}

function beginDrag(event) {
  event.dataTransfer.setData("text", event.target.id.split('_')[1]);
  event.dropEffect = "move";
  trashBin.setAttribute('drop', true);
}

function onAllowDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function onDrop(event) {
  trashBin.setAttribute('drop', false);

  let id = event.dataTransfer.getData("text");

  fetch(backendUrl + 'api/msgs/' + id, {
    method: 'DELETE',
    body: JSON.stringify({
      credentials: frontend + ':' + secret
    })
  }).then(function (response) {
    if (response.status === 200) {
      let element = document.getElementById('msg_' + id);
      board.removeChild(element);
    }
  });
}

function onDragEnd(event) {
  trashBin.setAttribute('drop', false);
}

function login() {
  frontend = formholderFrontend.value;
  secret = formholderSecret.value;

  formholder.parentElement.removeChild(formholder);
  formholderBackground.parentElement.removeChild(formholderBackground);

  containerFloating.removeAttribute('hidden');

  beginBoardLoad();
}

moment.locale('pt-BR');
