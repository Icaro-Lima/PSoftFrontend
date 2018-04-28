const table = document.getElementById('table');

let msgs = [];
function draw() {
  let html = '<thead class="thead-dark"><tr><th scope="row">#</th><th scope="col">Autor</th><th scope="col">Titulo</th><th scope="col">Mensagem</th></tr></thead>';
  html += "<tbody>";
  html += msgs.map(msg => `<tr><th scope="row">${msg.id}</th><td>${msg.author}</td><td>${msg.title}</td><td>${msg.msg}</td></tr>`).join();
  html += '<tr><th scope="row">+</th><td><input id="author" type="text"/></td><td><input id="title" type="text"/></td><td><input id="msg" type="text"/></td></tr></tbody>';

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
      credentials: 'icaro:amendoboboyeah'
    }),
  }).then(response => response.json()).then(function(response) {
    msgs.push({ id: response.id, author: inputAuthor.value, title: inputTitle.value, msg: inputMsg.value });
    draw();

    inputAuthor.value = '';
    inputTitle.value = '';
    inputMsg.value = '';
  });
}

fetch("http://150.165.85.16:9900/api/msgs").then(response => response.json()).then(function(json) {
  msgs = json;
  draw();
});
