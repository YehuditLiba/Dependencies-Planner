export const sendMessageToSlack = async (message) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error('Error sending message:', data);
      } else {
        console.log('Message sent successfully:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };