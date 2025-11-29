const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body);

  // Validate required fields
  if (!body.title || !body.date) {
    return { statusCode: 400, body: 'Title and date are required' };
  }

  const eventsFile = path.join(__dirname, '../../events.json');

  // Read existing events
  const eventsData = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));

  // Add new event
  eventsData.push({
    title: body.title,
    start: body.date + (body.time ? 'T' + body.time : ''),
    place: body.place || '',
    description: body.description || '',
    fee: body.fee || '',
    url: body.link || ''
  });

  // Write back to events.json
  fs.writeFileSync(eventsFile, JSON.stringify(eventsData, null, 2));

  return { statusCode: 200, body: 'Event added successfully' };
};
