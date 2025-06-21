export default async function SendMailFunc(mailData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_ServerUrl}/api/sendmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mailData)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
}
