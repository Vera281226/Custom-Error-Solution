export function saveLastRequest({ method, url }) {
  if (method.toUpperCase() !== 'GET') return;
  sessionStorage.setItem('lastRequest', JSON.stringify({ method, url }));
}

export function getLastRequest() {
  const raw = sessionStorage.getItem('lastRequest');
  return raw ? JSON.parse(raw) : null;
}

export function clearLastRequest() {
  sessionStorage.removeItem('lastRequest');
}
