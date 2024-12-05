const socket = io("http://localhost:8000");
const container = document.querySelector(".message");
const msginp = document.getElementById("inp");
const msgtosend = document.querySelector(".msg");
const btn = document.querySelector("button");
function appendto(message, position) {
  const msgele = document.createElement("div");
  msgele.innerHTML = message;
  msgele.classList.add("msg");
  msgele.classList.add(position);
  container.append(msgele);
}
function handleEvent() {
  const message = msginp.value;
  appendto(`You: ${message}`, "right");
  socket.emit("send", message);
  msginp.value = "";
}
btn.addEventListener("click", handleEvent);
msginp.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    handleEvent();
  }
});
const user = prompt("Enter your name to continue:");
if (user) {
  socket.emit("new-user-joined", user);
  socket.on("user-joined", (user) => {
    appendto(`${user} joined the chat`, "right");
  });
  socket.on("receive", (data) => {
    appendto(`${data.user}: ${data.message}`, "left");
  });
  socket.on("userleft", (data) => {
    appendto(data.message, "left");
  });
} else {
  alert("You must enter something to enter the chat");
  window.location.reload();
}
