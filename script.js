const API_URL = 'https://randomuser.me/api/?results=5';

const button = document.getElementById('download-btn');
const statusEl = document.getElementById('status');
const usersEl = document.getElementById('users');

const setStatus = (text = '') => {
  statusEl.textContent = text;
};

const setLoading = (isLoading) => {
  button.disabled = isLoading;
  button.classList.toggle('loading', isLoading);
  button.setAttribute('aria-busy', String(isLoading));
};

const createField = (label, value) => {
  const p = document.createElement('p');
  const labelSpan = document.createElement('span');
  labelSpan.className = 'label';
  labelSpan.textContent = label;
  p.append(labelSpan, document.createTextNode(value));
  return p;
};

const createCard = (user) => {
  const card = document.createElement('article');
  card.className = 'user-card';

  const img = document.createElement('img');
  img.src = user.picture.large;
  img.alt = `${user.name.first} ${user.name.last}`;

  const info = document.createElement('div');
  info.className = 'info';
  info.append(
    createField('Country', user.location.country),
    createField('E-mail', user.email),
    createField('Phone', user.phone),
    createField(
      'Coordinates',
      `${user.location.coordinates.latitude}, ${user.location.coordinates.longitude}`,
    ),
  );

  card.append(img, info);
  return card;
};

const render = (users) => {
  usersEl.replaceChildren(...users.map(createCard));
};

const loadUsers = () => {
  setLoading(true);
  setStatus();
  statusEl.classList.remove('success', 'error');

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      render(data.results);
      setStatus('success!');
      statusEl.classList.add('success');
    })
    .catch((error) => {
      console.error(error);
      setStatus(`Помилка завантаження: ${error.message}`);
      statusEl.classList.add('error');
    })
    .finally(() => {
      setLoading(false);
    });
};

button.addEventListener('click', loadUsers);
