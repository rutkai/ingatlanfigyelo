self.addEventListener('push', function (event) {
  let notificationData = {};

  try {
    notificationData = event.data.json();
    event.waitUntil(
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        data: {
          estate: notificationData.estate
        }
      })
    );
  } catch (e) {
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  let notificationData = {};

  try {
    notificationData = event.notification;
  } catch (e) {
  }

  // see if the current is open and if it is focus it
  // otherwise open new tab
  event.waitUntil(
    self.clients.matchAll({
      type: 'window'
    }).then(function (clientList) {
      if (clientList.length) {
        clientList[0].postMessage({
          command: 'update-estates'
        });

        if (notificationData.data.estate && 'navigate' in clientList[0]) {
          return clientList[0].navigate('/estate/' + notificationData.data.estate)
            .then(client => {
              return client.focus();
            });
        }

        if ('focus' in clientList[0]) {
          return clientList[0].focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(notificationData.data.estate ? '/estate/' + notificationData.data.estate : '/');
      }
    })
  );
});
