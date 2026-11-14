importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyAWm7HIsDcshGwjfXee_F_rojKmA0Isj4o",authDomain:"stilista-80a18.firebaseapp.com",projectId:"stilista-80a18",storageBucket:"stilista-80a18.firebasestorage.app",messagingSenderId:"832710411212",appId:"1:832710411212:web:2c678684def46cd4f35369"});
firebase.messaging();
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.FCM_MSG&&e.notification.data.FCM_MSG.notification&&e.notification.data.FCM_MSG.notification.click_action)||'/';e.waitUntil(clients.matchAll({type:'window'}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus()}return clients.openWindow(url)}))});
