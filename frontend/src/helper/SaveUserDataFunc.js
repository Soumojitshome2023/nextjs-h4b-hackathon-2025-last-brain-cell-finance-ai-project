
export default async function SaveUserDataFunc(userData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ServerUrl}/api/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update user data');
    }

    console.log('User data updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
}
