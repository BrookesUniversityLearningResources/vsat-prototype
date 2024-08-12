import { Magic } from 'magic-sdk';

export const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY);

export function logoutUser() {
  return magic.user.logout();
}

export async function authenticateWithServer(didToken) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${didToken}`,
    },
  });

  if (res.status === 200) {
    const user = await res.json();
    return Promise.resolve(user);
  } else {
    return Promise.reject(`Login failed: ${res.statusText}`);
  }
}
