# Social Junk

## Why

While social buttons are ugly, probably [horcruxes](https://twitter.com/lifewinning/status/529825882501042176), and definitely [tracking you](http://www.propublica.org/article/its-complicated-facebooks-history-of-tracking-you), there are times when they are unavoidable. This library is written to limit their interactions and overhead by asynchronously loading social libraries only when needed.

**Note:** You should probably [block](https://www.ghostery.com/) social buttons.

## Usage

[UMD](https://github.com/umdjs/umd) so use how you would like.

### Options

#### `facebookAppId`

Optionally set your Facebook App ID.

### Examples

Initialize:

```javascript
new SocialJunk();
```

Initialize with Facebook App ID:

```javascript
new SocialJunk( {
	facebookAppId: '123456789'
} );
```

Listen for an event:

```javascript
document.addEventListener( 'twitter:loaded', function ( event ) {
	console.log( event.type );
} );
```

## Events

### Facebook

#### `facebook:libraryLoaded`

Library script has loaded.

#### `facebook:loaded`

All buttons are rendered.

### Google+

#### `googleplus:libraryLoaded`

Library script has loaded.

### Twitter

#### `twitter:libraryLoaded`

Library script has loaded.

#### `twitter:rendered`

**Parameter:** `event.rendered` HTML element

Button is rendered.

#### `twitter:loaded`

**Parameter:** `event.loaded` array of HTML elements

All buttons are rendered.

## Contributing

Dudes (like Facebook) tend to change things up often. If this happens, feel free to fix.

Run the following for the uglified version:

```bash
npm run build-js
```

## Browser Support

Probably IE 9+ ¯\_(ツ)_/¯