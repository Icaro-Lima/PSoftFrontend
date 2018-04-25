const table = document.getElementById('table');

let msgs = [];
function draw() {
  let html = '<thead><tr><th>Autor</th><th>Titulo</th><th>Mensagem</th></tr></thead>';
  html += msgs.map(msg => `<tbody><tr><td>${msg.author}</td><td>${msg.title}</td><td>${msg.msg}</td></tr>`).join();
  html += '<tr><td><input id="author" type="text"/></td><td><input id="title" type="text"/></td><td><input id="msg" type="text"/></td></tr></tbody>';

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
  }).then(function(response) {
    msgs.push({ author: inputAuthor.value, title: inputTitle.value, msg: inputMsg.value });
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
