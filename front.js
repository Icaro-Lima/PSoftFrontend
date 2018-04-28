const table = document.getElementById('table');

const frontEnd = 'icaro';
const credentials = 'icaro:amendoboboyeah';

let msgs = [];
function draw() {
  let html = '<thead class="thead-dark"><tr><th scope="row">#</th><th scope="col">Autor</th><th scope="col">Titulo</th><th scope="col">Mensagem</th><th score="col"></th></tr></thead>';
  html += '<tbody><tr><th scope="row">+</th><td><input id="author" type="text"/></td><td><input id="title" type="text"/></td><td><input id="msg" type="text"/></td><td><button type="button" class="btn btn-success" onclick="submit()">Publicar</button></td></tr>';
  for (let i = msgs.length - 1; i >= 0; i--) {
    let msg = msgs[i];
    html += `<tr><th scope="row">${msg.id}</th><td>${msg.author}</td><td>${msg.title}</td><td>${msg.msg}</td>`;
    if (msg.frontend === frontEnd) {
      html += `<td><button type="button" id="${msg.id}" class="btn btn-dark" onclick="remove(this)">Remover</button></td></tr>`;
    } else {
      html += `<td><button type="button" id="${msg.id}" class="btn btn-dark" onclick="remove(this)" disabled>Remover</button></td></tr>`;
    }
  }
  html += '</tbody>';
  table.innerHTML = html;
}

function submit() {
  let inputMsg = document.getElementById('msg');
  let inputTitle = document.getElementById('title');
  let inputAuthor = document.getElementById('author');

  fetch('http://150.165.85.16:9900/api/msgs', {
    method: 'POST',
    body: JSON.stringify({
      author: inputAuthor.value,
      title: inputTitle.value,
      msg: inputMsg.value,
      credentials: credentials
    }),
  }).then(function (response) {
    return response.json();
  }).then(function(response) {
    if (response.id) {
      msgs.push({ id: response.id, author: inputAuthor.value, title: inputTitle.value, msg: inputMsg.value, frontend: frontEnd });
      draw();

      inputAuthor.value = '';
      inputTitle.value = '';
      inputMsg.value = '';
    } else {
      alert(response.message);
    }
  });
}

function remove(butt) {
  fetch('http://150.165.85.16:9900/api/msgs/' + butt.id, {
    method: 'DELETE',
    body: JSON.stringify({
      credentials: credentials
    })
  }).then(function () {
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].id == butt.id) {
        msgs.splice(i, 1);
      }
    }
  }).then(function () {
    draw();
  });
}

fetch("http://150.165.85.16:9900/api/msgs").then(response => response.json()).then(function(json) {
  msgs = json;
  draw();
});
