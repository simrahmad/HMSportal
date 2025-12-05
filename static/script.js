async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${u.id}</td>
      <td><input value="${u.name}" onchange="updateUser(${u.id}, this.value, null)"></td>
      <td><input value="${u.email}" onchange="updateUser(${u.id}, null, this.value)"></td>
      <td><button onclick="deleteUser(${u.id})">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function addUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  if (!name || !email) return alert("Enter name and email");
  await fetch('/api/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email})
  });
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  loadUsers();
}

async function updateUser(id, name, email) {
  const row = event.target.parentElement.parentElement;
  name = name ?? row.children[1].querySelector('input').value;
  email = email ?? row.children[2].querySelector('input').value;
  await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email})
  });
}

async function deleteUser(id) {
  if (!confirm("Delete user?")) return;
  await fetch(`/api/users/${id}`, {method: 'DELETE'});
  loadUsers();
}

loadUsers();
