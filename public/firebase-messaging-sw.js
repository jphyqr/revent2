 //import firebase from "firebase";


importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js");
importScripts('/__/firebase/init.js');








const firebaseConfig = {
    messagingSenderId: "424558437895"
}
 

firebase.initializeApp(firebaseConfig);
console.log('firebase messaging', firebase.messaging())
 const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(payload => {
    console.log('setBackground code reached')
   const title = payload.notification.title;
   console.log('payload', payload.notification.icon);
   const options = {
      body: payload.notification.body,
      icon: payload.notification.icon
   }
   return self.registration.showNotification(title, options);
})
 


messaging.onTokenRefresh(()=> {
    messaging.getToken().then((refreshedToken) =>{
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
  //    setTokenSentToServer(false);
      // Send Instance ID token to app server.
    //  sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
  //    resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
   //   showToken('Unable to retrieve refreshed token ', err);
    });
  });



self.addEventListener("notificationclick", function(event) {
    console.log('notification click code reached')
    const clickedNotification = event.notification;
    clickedNotification.close();
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
         })
        .then(windowClients => {
            let matchingClient = null;
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === feClickAction) {
                    matchingClient = windowClient;
                    break;
                }
            }
            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(feClickAction);
            }
        });
        event.waitUntil(promiseChain);
 });