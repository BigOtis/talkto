// userAPI.js

const BASE_URL = 'api';

export const addEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/addEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Response is not OK');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/removeEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

    if (!response.ok) {
      throw new Error('Response is not OK');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function verifyEmail(email, token) {
  const response = await fetch('/verifyEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token })
  });
  return await response.json();
}

export async function resendToken(email) {
  const response = await fetch('/resendToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await response.json();
}
