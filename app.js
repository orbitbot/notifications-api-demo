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
Demo.notifications = [];
Demo.form = {
  title : '',
  dir   : 'auto',
  body  : '',
  tag   : '',
  icon  : '',
  data  : {}
};
Demo.helpers = {};
Demo.helpers.setValue = function(obj, field) {
  return function(evt) { obj[field] = evt.target.value; };
};

Demo.helpers.titleHandler = Demo.helpers.setValue(Demo.form, 'title');
Demo.helpers.bodyHandler  = Demo.helpers.setValue(Demo.form, 'body');

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
  var notif = new Notification(Demo.form.title, {
    body : Demo.form.body,
    // dir
    // lang
    // tag
    // icon
    // data
  });
  notif.addEventListener('close', function() {
    var index = Demo.notifications.indexOf(notif);
    if (index > -1)
      Demo.notifications.splice(index, 1);
    notif.removeEventListener('close', this);
  });

  Demo.notifications.push(notif);
}

var defaultView = function() {
  var h = maquette.h;
  return h('button', { onclick : Demo.requestPermission, key: 'default' }, [
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
  return  h('form', { onsubmit: 'return false' }, [
            h('div', [
              'title:',
              h('input', {
                type: 'text', value: Demo.form.title, oninput: Demo.helpers.titleHandler
              }),
            ]),
            h('div', [
              'body:',
              h('input', {
                type: 'text', value: Demo.form.body, oninput: Demo.helpers.bodyHandler
              })
            ]),
            h('pre', [
              'new Notification(\'' + Demo.form.title + '\', {\n' +
                '    body: \'' + Demo.form.body + '\',\n' +
                '    dir: \'auto,\n' +
              '})' + JSON.stringify(Demo.form, null, 4)
            ]),
            h('button', { onclick : Demo.showNotification, key: 'granted' }, [
              'Show Notification'
            ]),
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
