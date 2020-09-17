# snowfall.js

A nice snow effect drawn in a canvas element, perfect for a classic 90's Winter theme.
[Config Editor Available](http://erikwatson.me/snowfall)

## Features

- [Visual config editor](http://)
- Foreground and Background Layers
- Proportional number of snowflakes across resolutions
- Small, with no dependencies

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
snowfall.start()
```

## Build it yourself

- `git clone git@github.com:championchap/SnowFall.js.git`
- `yarn install`
- `yarn build`

## Authors

- [Erik Watson](http://erikwatson.me)
