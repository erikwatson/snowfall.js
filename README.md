# snowfall.js

The perfect snow effect for your Winter themed website!

Suggested use: attach it as a fixed background to your page with the content displayed over the top.

## Features

- [Visual config editor](https://erikwatson.github.io/snowfall-editor/)
- [API Reference](https://erikwatson.github.io/snowfall.js/)
- Easy to use.
- Simple, but beautiful.
- Multiple layers give the illusion of depth.
- Density of snowflakes looks correct even when the window is resized.
- Small, with no dependencies.

## Instructions

First, install.

```sh
# if you're using yarn
yarn add @erikwatson/snowfall

# if you're using npm
npm install @erikwatson/snowfall
```

Then...

```html
<!-- You are expected to size and position this yourself with CSS -->
<div id="snow-container"></div>

<!-- Include the lib, wherever you've put it -->
<script type="text/javascript" src="./path/to/snowfall.min.js"></script>
```

```js
// You can change the defaults by passing in a config object here
// Use the Visual Config Editor to create one
snowfall.start()
```

## Authors

- [Erik Watson](http://erikwatson.me)
