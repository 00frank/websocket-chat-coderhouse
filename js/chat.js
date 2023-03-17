const socket = io();

let user;
const chatbox = document.getElementById("chatbox");

// mando una alerta pidiendo el nombre de usuario
// luego envio el evento de autenticacion
Swal.fire({
  title: "BIENVENIDO, por favor Identificate",
  input: "text",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

// proceso para leer el input y enviar el mensaje
chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
        console.log(user, chatbox.value)
      socket.emit("message", { user: user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

// evento para mostrar todos los mensajes recibidos
socket.on("messageLogs", (data) => {
  if (!user) return;
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((msg) => {
    messages += `${msg.user} dice: ${msg.message}<br/>`;
  });
  log.innerHTML = messages;
});

// evento para cuando un usuario inicia sesión
socket.on("newUserConnected", (user, messages) => {
  if (!user) return;
  Swal.fire({
    title: `el ${user} ha iniciado sesion`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    icon: "success",
  }); 
});

// evento para mostrar todos los mensajes recibidos cuando el usuario hace su primer logging
socket.on("loadMessages", async messages => {
    let log = document.getElementById("messageLogs");
    let messagesStr = "";
    messages.forEach((msg) => {
      messagesStr += `${msg.user} dice: ${msg.message}<br/>`;
    });
    log.innerHTML = messagesStr;
});