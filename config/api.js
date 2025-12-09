const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aiinfluencerphase1backend.onrender.com';
// let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// // Ensure the URL always has a protocol
// if (API_URL && !API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
//   API_URL = 'http://' + API_URL;
// }

// console.log('API_URL:', API_URL); // Debug log to verify API URL

export default API_URL;
