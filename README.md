# Snowfall :: Stay cool

The perfect snow effect for your Winter themed website!

Suggested use: attach it as a fixed background to your page with the content
displayed over the top. [Check out this example](http://erikwatson.me/?snow).

## Features

- Easy to use
- Beautiful
- Highly configurable | [API docs](https://erikwatson.github.io/snowfall-docs/) | [Config editor](https://erikwatson.github.io/snowfall-editor/)
- Consistent density of snowflakes, regardless of screen size
- No bunching or thinning on resize
- Scheduling, so you can set it and forget it
- Scrolls with the page
- [React wrapper](https://www.npmjs.com/package/@erikwatson/react-snowfall)

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

If you're using a CDN, add the following

```html
<script src="https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.3/dist/index.min.js"></script>
<script>
  snowfall.start({
    layers: [{}]
  })
</script>
```

Otherwise, install it with your favourite package manager and include it in your projects build step.

```sh
npm install @erikwatson/snowfall
```

```ts
import snowfall from '@erikwatson/snowfall'

snowfall.start({
  layers: [{}]
})
```

### Custom configs

Same as above but we pass a config object. Your config overrides the default settings.

If you're using TypeScript, import the UserConfig type too.

```ts
import snowfall, { UserConfig } from '@erikwatson/snowfall'

const config: UserConfig = {
  layers: [
    {
      colour: '#8d90b7'
    }
  ]
}

snowfall.start(config)
```

### Scheduling

Same as the above, but we pass a schedule config and the optional snowfall config to the `.schedule(user_schedule, user_config)` function.

If you're using TypeScript, import the UserSchedule type too.

```ts
import snowfall, { UserSchedule } from '@erikwatson/snowfall'

const userSchedule: UserSchedule = {
  from: { month: 12, day: 1 },
  to: { month: 12, day: 31 }
}

const config: UserConfig = {
  layers: [
    {
      colour: '#8d90b7'
    }
  ]
}

snowfall.schedule(userSchedule, config)
```

### CDN Links

[![](https://data.jsdelivr.com/v1/package/npm/@erikwatson/snowfall/badge)](https://www.jsdelivr.com/package/npm/@erikwatson/snowfall)

- Latest 4.x (minified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4/dist/index.min.js`
- Latest 4.x (unminified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4/dist/index.js`
- Latest 4.3.x (minified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.3/dist/index.min.js`
- Latest 4.3.x (unminified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.3/dist/index.js`
- Specific version (minified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.3.0/dist/index.min.js`
- Specific version (unminified): `https://cdn.jsdelivr.net/npm/@erikwatson/snowfall@4.3.0/dist/index.min.js`

## Author

- [Erik Watson](http://erikwatson.me)
