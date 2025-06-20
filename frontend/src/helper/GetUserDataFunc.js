export default async function GetUserDataFunc(email) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ServerUrl}/api/user?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch user data');
    }

    console.log('User data fetched:', result);
    return result;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
}
