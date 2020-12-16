# vue-native-notification

Vue.js 3 plugin for native notifications with composition API hook.

## Install

```
npm install --save vue3-native-notification
```

## Usage

### Add plugin

```javascript
import { createApp } from 'vue'
import Vue3NativeNotification from 'vue3-native-notification'

const app = createApp()

app.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true,
})
```

### Show notification

```html
<template>
  <button type="button" @click="notify">Show notification</button>
</template>

<script>
  export default defineComponent({
    name: 'SimpleComponent',
    setup() {
      const nativeNotification = useNativeNotification()

      const notify = function () {
        nativeNotification.show(
          'Notification',
          {
            body: 'This is a simple notification',
          },
          {},
        )
      }
    },
  })
</script>

<style></style>
```

### Manual permission request

You can manually request users permission with:

```javascript
// Global
app.notification.requestPermission().then(console.log) // Prints "granted", "denied" or "default"

// Component
//...
setup() {
  const nativeNotification = useNativeNotification()

  //...
  nativeNotification.requestsPermission().then(console.log)
},
//...
```

### Events

https://developer.mozilla.org/en-US/docs/Web/API/Notification

We now supports all notifications events

#### onerror

https://developer.mozilla.org/en-US/docs/Web/API/Notification/onerror

Is an empty function. Nothing will be executed

#### onclick

https://developer.mozilla.org/en-US/docs/Web/API/Notification/onclick

When notification is clicked, we set the focus on the context browser and close the notification

#### onclose

https://developer.mozilla.org/en-US/docs/Web/API/Notification/onclose

Is an empty function. Nothing will be executed

#### onshow

https://developer.mozilla.org/en-US/docs/Web/API/Notification/onshow

Is an empty function. Nothing will be executed

#### Usage

```javascript
const notification = {
  title: 'Your title',
  options: {
    body: 'This is an example!',
  },
  events: {
    onerror: function () {
      console.log('Custom error event was called')
    },
    onclick: function () {
      console.log('Custom click event was called')
    },
    onclose: function () {
      console.log('Custom close event was called')
    },
    onshow: function () {
      console.log('Custom show event was called')
    },
  },
}
this.$notification.show(
  notification.title,
  notification.options,
  notification.events,
)
```

## License

[MIT](LICENSE.md)
