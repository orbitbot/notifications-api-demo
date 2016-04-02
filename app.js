var currNotification;

function showNotification() {
  if (Notification.permission !== 'denied') {
    if (Notification.permission === 'granted') {
      currNotification = new Notification('Hello thingie');
    } else {    
      Notification.requestPermission(function(permission) { // would return promise w/o callback
        console.log('requestPermission result: ' + permission);
        showNotification();
      });
    } 
  } else {
    alert('Notifications blocked');
  }
}

if (!window.Notification) {
  showNotification = function() {
    alert('Notifications not available in this browser');
  };
}

