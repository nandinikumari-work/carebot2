export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful health assistant that provides general advice and over-the-counter suggestions based on symptoms. Do NOT provide prescriptions or diagnose. Be polite and simple.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ reply: data.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ reply: "Sorry, I couldn't generate a response." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error communicating with AI. Please try again later." });
  }
}
