// Service Worker for Quran WordMaster
// Handles interactive notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  const clickedAction = event.action;
  const data = event.notification.data || {};
  const correctAnswer = data.correctAnswer;
  
  // Close the initial question notification
  event.notification.close();

  if (!clickedAction) {
    // If user clicked the notification body (not a button), open the app
    event.waitUntil(
      self.clients.matchAll({type: 'window'}).then((clientList) => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
    return;
  }

  // Handle Action Button Click (Answering inside notification)
  let title = '';
  let body = '';
  const isCorrect = clickedAction === correctAnswer;

  if (isCorrect) {
    title = '✅ Correct! / أحسنت';
    body = `MashAllah! "${correctAnswer}" is the right answer.`;
  } else {
    title = '❌ Incorrect / خطأ';
    body = `The correct answer was: "${correctAnswer}"`;
  }

  // Show feedback notification
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063216.png', // Fallback to a CDN icon
      badge: 'https://cdn-icons-png.flaticon.com/512/3063/3063216.png',
      tag: 'feedback-notification',
      renotify: true
    })
  );
});