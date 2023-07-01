const API_URL = 'api'; 

export const registerEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/addEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Response was not ok');
    }

    return;
  } catch (error) {
    console.error('Error registering email:', error);
  }
};

export const removeEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/removeEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

    if (!response.ok) {
      throw new Error('Response was not ok');
    }

    return;
  } catch (error) {
    console.error('Error removing email:', error);
  }
};