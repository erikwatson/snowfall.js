# Snowfall :: Stay cool

The perfect snow effect for your Winter themed website!

Suggested use: attach it as a fixed background to your page with the content
displayed over the top. [Check out this example](demo).

## Features

- Easy to use
- Beautiful
- Highly configurable | [API docs](api-docs) | [Config editor](editor)
- Consistent density of snowflakes, regardless of screen size
- Scheduling, so you can set it and forget it

## Instructions

First, add a div with an ID of `snowfall` to your page.

```html
<div id="snowfall"></div>
```

It's recommended that you make it full screen and attach it to the background, something like this.

```html
<style>
  #snowfall {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }
</style>
```

Then, at the bottom of your page body add the following, this will run snowfall with the default settings.

```html
<script src="https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4/dist/index.min.js"></script>
<script>
  snowfall.start()
</script>
```

### Custom configs

Same as above but we pass a config object. Your config overrides the default settings.

```js
snowfall.start({
  layers: [
    {
      colour: '#ff0000'
    }
  ]
})
```

### Scheduling

Same as the above, but we pass a schedule config and the optional snowfall config to the `.schedule(user_schedule, user_config)` function.

```js
const userSchedule = {
  from: { month: 12, day: 1 },
  to: { month: 12, day: 31 }
}
snowfall.schedule(userSchedule, {
  layers: [
    {
      colour: '#ff0000'
    }
  ]
})
```

### CDN Links

- Latest 4.x (minified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4/dist/index.min.js`
- Latest 4.x (unminified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4/dist/index.js`
- Specific version: `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.0.0/dist/index.min.js`

## Author

- [Erik Watson](erik)

[erik]: http://erikwatson.me
[user-schedule]: https://erikwatson.github.io/snowfall-docs/interfaces/UserSchedule.html
[user-config]: https://erikwatson.github.io/snowfall-docs/interfaces/UserConfig.html
[api-docs]: https://erikwatson.github.io/snowfall-docs/
[editor]: https://erikwatson.github.io/snowfall-editor/
[demo]: http://erikwatson.me/?snow
