import { inject } from 'vue'
// Notification object
const Notification = window.Notification || window.webkitNotification

const onerror = function onerror (event) {
  // console.log('On error event was called')
}

const onclick = function onclick (event) {
  // console.log('On click event was called')
  event.preventDefault()
  window.focus()
  event.target.close()
}

const onclose = function onclose (event) {
  // console.log('On close event was called')
}

const onshow = function onshow (event) {
  // console.log('On show event was called')
}

const defaultEvents = {
  onerror: onerror,
  onclick: onclick,
  onclose: onclose,
  onshow: onshow
}

// Plugin
const Vue3NativeNotification = {
  install: function (app, options) {
    options = options || {}
    options.requestOnNotify = options.requestOnNotify || true

    app.notification = {}
    app.config.globalProperties.$notification = {}

    // Manual permission request
    const requestPermission = function () {
      return Notification.requestPermission()
    }
    app.notification.requestPermission = requestPermission
    app.config.globalProperties.$notification.requestPermission = requestPermission

    // Show function
    const show = function (title, opts, e) {
      if (!e.onerror) e.onerror = function () {}
      if (!e.onclick) e.onclick = function () {}
      if (!e.onclose) e.onclose = function () {}
      if (!e.onshow) e.onshow = function () {}
      return Promise.resolve()
        .then(function () {
          if (
            options.requestOnNotify &&
            Notification.permission !== 'granted'
          ) {
            return requestPermission()
          }

          return Notification.permission
        })
        .then(function (permission) {
          // "default" doesn't mean "denied"
          // It means the user has dismissed the request
          if (permission === 'denied') {
            return new Error('No permission to show notification')
          }

          const bindOnError = function (event) {
            'use strict'
            defaultEvents.onerror(event)
            e.onerror(event)
          }

          const bindOnClick = function (event) {
            'use strict'
            defaultEvents.onclick(event)
            e.onclick(event)
          }

          const bindOnClose = function (event) {
            'use strict'
            defaultEvents.onclose(event)
            e.onclose(event)
          }

          const bindOnShow = function (event) {
            'use strict'
            defaultEvents.onshow(event)
            e.onshow(event)
          }

          // Create Notification object
          try {
            const notification = new Notification(title, opts)

            notification.onerror = bindOnError
            notification.onclick = bindOnClick
            notification.onclose = bindOnClose
            notification.onshow = bindOnShow

            return notification
          } catch (e) {
            if (e.name !== 'TypeError') {
              return e
            }

            return navigator.serviceWorker.ready
              .then(function (reg) {
                reg.showNotification(title, opts)
              })
              .then(bindOnShow, bindOnError)
          }
        })
    }
    app.notification.show = show
    app.config.globalProperties.$notification.show = show

    app.provide('vue3NativeNotifications', app.config.globalProperties.$notification)
  }
}

export function useNativeNotifications () {
  return inject('vue3NativeNotifications')
}

// Export plugin
export default Vue3NativeNotification
