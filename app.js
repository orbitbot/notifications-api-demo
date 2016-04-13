var Demo = {};
Demo.projector = maquette.createProjector();
Demo.state = new StateMachine({
  initial: window.Notification ? window.Notification.permission : 'unsupported',
  states: {
    'default'     : ['denied', 'granted'],
    'denied'      : ['default', 'granted'],
    'granted'     : ['default', 'denied'],
    'unsupported' : []
  }
});

if (Demo.state.current !== 'unsupported') {
  setInterval(function() {
    if (Notification.permission !== Demo.state.current)
      Demo.state.go(Notification.permission);
  }, 1000);
}

Demo.state.on('all', function() {
  Demo.projector.scheduleRender();
})

Demo.requestPermission = Notification.requestPermission.bind({}, Demo.state.go);
Demo.showNotification = function() {
  Demo.notification = new Notification('Hello notification!');
}

var defaultView = function() {
  var h = maquette.h;
  return h('button', { onclick : Demo.requestPermission }, [
     'Enable Notifications'
   ]);
};

var deniedView = function() {
  var h = maquette.h;
  return h('div', [
     'denied'
   ]);
};

var grantedView = function() {
  var h = maquette.h;
  return h('button', { onclick : Demo.showNotification }, [
     'Show Notifications'
   ]);
};

var unsupportedView = function() {
  var h = maquette.h;
  return h('div', [
     'unsupported'
   ]);
};


window.addEventListener('load', function() {
  var components = {
    default     : defaultView,
    denied      : deniedView,
    granted     : grantedView,
    unsupported : unsupportedView,
  }

  Demo.projector.replace(document.getElementById('app'), function() {
    return maquette.h('div', [ components[Demo.state.current]() ]);
  });
});
