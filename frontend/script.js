const API = "http://127.0.0.1:8000/api/tasks/";

/* USER MAP */
const USERS = {
  1: "Maria",
  2: "John"
};

let currentUserId;
let currentView = "dashboard";

/* ---------------- TIME FORMAT ---------------- */
function timeAgo(dateString) {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
  if (diff < 604800) return Math.floor(diff / 86400) + " days ago";

  return past.toLocaleDateString();
}

/* ---------------- INIT USER ---------------- */
function initUser() {
  let saved = sessionStorage.getItem("userId");

  if (!saved) {
    saved = prompt("Enter User ID (1 or 2):");

    while (saved !== "1" && saved !== "2") {
      alert("❌ Invalid input. Please enter ONLY 1 or 2.");
      saved = prompt("Enter User ID (1 or 2):");
    }

    sessionStorage.setItem("userId", saved);
  }

  currentUserId = Number(saved);

  document.getElementById("userDisplay").innerText =
    USERS[currentUserId];
}

/* ---------------- SWITCH USER ---------------- */
function switchUser() {
  sessionStorage.removeItem("userId");
  location.reload();
}

/* ---------------- VIEW SWITCH ---------------- */
function setView(view) {
  currentView = view;

  const createBox = document.getElementById("createBox");
  if (createBox) {
    createBox.style.display = view === "dashboard" ? "block" : "none";
  }

  loadTasks();
}

/* ---------------- OFFER TYPE ---------------- */
function handleOfferType() {
  let type = document.getElementById("offerType").value;

  document.getElementById("cashInput").style.display =
    type === "cash" ? "block" : "none";

  document.getElementById("goodsInput").style.display =
    type === "goods" ? "block" : "none";
}

/* ---------------- LOAD TASKS ---------------- */
function loadTasks() {
  fetch(API)
    .then(res => res.json())
    .then(data => {

      let list = document.getElementById("taskList");
      list.innerHTML = "";

      let availableTasks = 0;
      let ongoingCount = 0;
      let completedCount = 0;
      let myRequests = 0;
      let dashboardAvailable = 0;

      data.forEach(task => {

        const isOwner = Number(task.created_by) === currentUserId;

        if (!isOwner && task.status === "pending") availableTasks++;
        if (task.status === "ongoing") ongoingCount++;
        if (task.status === "completed") completedCount++;
        if (isOwner) myRequests++;

        if (!isOwner && task.status === "pending" && !task.accepted_by) {
          dashboardAvailable++;
        }
      });

      /* ---------------- RENDER ---------------- */
      data.forEach(task => {

        const isOwner = Number(task.created_by) === currentUserId;

        if (currentView === "dashboard") {
          if (
            task.status !== "pending" ||
            isOwner ||
            task.accepted_by
          ) return;
        }

        if (currentView === "ongoing" && task.status !== "ongoing") return;
        if (currentView === "completed" && task.status !== "completed") return;
        if (currentView === "requests" && !isOwner) return;

        const ownerText = isOwner ? "You" : USERS[task.created_by] || "Unknown";

        let acceptedText = "";
        if (isOwner && task.accepted_by) {
          acceptedText = `<small>🤝 Accepted by: ${USERS[task.accepted_by] || "User"}</small><br>`;
        }

        let buttons = "";

        if (isOwner) {
          if (task.status !== "completed") {
            buttons = `
              <button onclick="deleteTask(${task.id})">Delete</button>
              <button onclick="completeTask(${task.id})">Complete</button>
            `;
          } else {
            buttons = `<span style="color:green;">✔ Completed</span>`;
          }
        } else {
          if (task.status === "pending") {
            buttons = `<button onclick="acceptTask(${task.id})">Accept</button>`;
          } else if (task.status === "ongoing") {
            buttons = `<span style="color:orange;">Ongoing</span>`;
          } else {
            buttons = `<span style="color:green;">✔ Done</span>`;
          }
        }

        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
          <b>${task.title}</b><br>
          ${task.description}<br>

          <small>👤 ${ownerText}</small><br>
          ${acceptedText}
          <small>${task.exchange_offer || ""}</small><br>
          <small>Status: ${task.status}</small><br>
          <small>🕒 ${timeAgo(task.created_at)}</small><br><br>

          ${buttons}
        `;

        list.appendChild(div);
      });

      /* DASHBOARD STATS */
      document.getElementById("total").innerText = dashboardAvailable;
      document.getElementById("ongoing").innerText = ongoingCount;
      document.getElementById("completed").innerText = completedCount;

      /* SIDEBAR */
      document.getElementById("taskLabel").innerText = `(${availableTasks})`;
      document.getElementById("ongoingLabel").innerText = `(${ongoingCount})`;
      document.getElementById("completedLabel").innerText = `(${completedCount})`;
      document.getElementById("requestLabel").innerText = `(${myRequests})`;

    });
}

/* ---------------- ADD TASK (FIXED) ---------------- */
function addTask() {

  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const type = document.getElementById("offerType").value;

  const cash = document.getElementById("cashInput").value.trim();
  const goods = document.getElementById("goodsInput").value.trim();

  if (!title || !desc) {
    alert("Please fill Title and Description");
    return;
  }

  if (!type) {
    alert("Select Offer Type");
    return;
  }

  let offer = "";

  if (type === "cash") {
    if (!cash) return alert("Enter cash amount");
    offer = "Cash: ₱" + cash;
  }

  if (type === "goods") {
    if (!goods) return alert("Enter goods");
    offer = "Goods: " + goods;
  }

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description: desc,
      exchange_offer: offer,
      created_by: currentUserId,
      status: "pending"
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to add task");
    return res.json();
  })
  .then(() => {

    loadTasks();

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("cashInput").value = "";
    document.getElementById("goodsInput").value = "";
    document.getElementById("offerType").value = "";

    document.getElementById("cashInput").style.display = "none";
    document.getElementById("goodsInput").style.display = "none";

    alert("Task added ✅");
  })
  .catch(err => {
    console.error(err);
    alert("Error adding task ❌ Check backend");
  });
}

/* ---------------- DELETE ---------------- */
function deleteTask(id) {
  fetch(API + id + "/", { method: "DELETE" })
    .then(() => loadTasks());
}

/* ---------------- ACCEPT ---------------- */
function acceptTask(id) {
  fetch(API + id + "/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "ongoing",
      accepted_by: currentUserId
    })
  }).then(() => loadTasks());
}

/* ---------------- COMPLETE ---------------- */
function completeTask(id) {
  fetch(API + id + "/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "completed"
    })
  }).then(() => loadTasks());
}

/* ---------------- INIT ---------------- */
initUser();
setView("dashboard");
loadTasks();