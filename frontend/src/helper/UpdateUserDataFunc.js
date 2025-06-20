export default async function UpdateUserDataFunc(userData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ServerUrl}/api/user/update`, {
      method: 'POST', // or 'PUT' if you're following REST conventions
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
