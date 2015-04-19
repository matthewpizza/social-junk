( function ( root, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		root.SocialJunk = factory();
	}
}( this, function () {

	/**
	 * Load social libraries if markup exists.
	 *
	 * @param object options
	 */
	function SocialJunk( options ) {

		this.options = options || {};

		if ( this.hasFacebookMarkup() ) {
			this.createFacebookRootElement();
			this.loadFacebookLibrary();
		}

		if ( this.hasGooglePlusMarkup() ) {
			this.loadGooglePlusLibrary();
		}

		if ( this.hasTwitterMarkup() ) {
			this.createTwitterObject();
			this.bindTwttrEvents();
			this.loadTwitterLibrary();
		}

	}

	/**
	 * Do any of the elements exists in the document?
	 *
	 * @param  array   classes
	 * @return boolean
	 */
	SocialJunk.prototype.hasMarkup = function ( classes ) {

		for ( var i = 0; i < classes.length; i++ ) {
			if ( 0 !== document.getElementsByClassName( classes[i] ).length ) {
				return true;
			}
		}

		return false;

	};

	/**
	 * Asynchronously load javascript library by URL.
	 *
	 * @param string   url      The full URL with protocol for the library.
	 * @param string   id       The id for the script element. Used to check that is doesn't already exits.
	 * @param function callback A callback function on load. Optional.
	 */
	SocialJunk.prototype.loadLibrary = function ( url, id, callback ) {

		callback = callback || function () {};

		if ( null !== document.getElementById( id ) ) {
			callback();
			return;
		}

		var library = document.createElement( 'script' );
		library.id = id;
		library.src = url;
		library.type = 'text/javascript';
		library.async = 'true';
		library.defer = 'true';
		library.addEventListener( 'load', callback, false );

		var script = document.getElementsByTagName( 'script' )[ 0 ];
		script.parentNode.insertBefore( library, script );

	}

	/**
	 * Does the document have Facebook follow or like button markup?
	 *
	 * @return boolean
	 */
	SocialJunk.prototype.hasFacebookMarkup = function () {

		return this.hasMarkup( [
			'fb-like',
			'fb-share-button',
			'fb-send',
			'fb-post',
			'fb-video',
			'fb-comments',
			'fb-page',
			'fb-follow'
		] );

	};

	/**
	 * Asynchronously load the Facebook library.
	 *
	 * @see https://developers.facebook.com/docs/javascript
	 */
	SocialJunk.prototype.loadFacebookLibrary = function () {

		var url = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3';

		if ( this.options.facebookAppId ) {
			url += '&appId=' + this.options.facebookAppId;
		}

		this.loadLibrary( url, 'facebook-jssdk', this.facebookEvents );

	};

	/**
	 * Create #fb-root element if it doesn't exist.
	 *
	 * The Facebook sdk will complain if this isn't present.
	 */
	SocialJunk.prototype.createFacebookRootElement = function () {

		if ( null !== document.getElementById( 'fb-root' ) ) {
			return;
		}

		var element = document.createElement( 'div' );
		element.id = 'fb-root';

		document.body.insertBefore( element, document.body.childNodes[ 0 ] );

	};

	/**
	 * Dispatch Facebook events for loaded and rendered.
	 *
	 * @see  https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v2.2
	 * @uses FB.Event.subscribe
	 */
	SocialJunk.prototype.facebookEvents = function () {

		var libraryLoaded = new Event( 'facebook:libraryLoaded' ),
			loaded = new Event( 'facebook:loaded' );

		document.dispatchEvent( libraryLoaded );

		FB.Event.subscribe( 'xfbml.render', function () {
			document.dispatchEvent( loaded );
		} );

	};

	/**
	 * Does the document have Google+ follow button markup?
	 *
	 * @return boolean
	 */
	SocialJunk.prototype.hasGooglePlusMarkup = function () {

		return this.hasMarkup( [
			'g-interactivepost',
			'g-plusone',
			'g-person',
			'g-post',
			'g-follow',
			'g-hangout'
		] );

	};

	/**
	 * Asynchronously load the Google+ library.
	 */
	SocialJunk.prototype.loadGooglePlusLibrary = function () {

		this.loadLibrary( 'https://apis.google.com/js/platform.js', 'googleplus-js', this.googlePlusEvents );

	};

	/**
	 * Dispatch Google+ loaded event.
	 */
	SocialJunk.prototype.googlePlusEvents = function () {

		var loaded = new Event( 'googleplus:libraryLoaded' );

		document.dispatchEvent( loaded );

	};

	/**
	 * Does the document have Twitter follow button markup?
	 *
	 * @return boolean
	 */
	SocialJunk.prototype.hasTwitterMarkup = function () {

		return this.hasMarkup( [
			'twitter-follow-button',
			'twitter-share-button',
			'twitter-hashtag-button',
			'twitter-mention-button'
		] );

	};

	/**
	 * Asynchronously load the Twitter library.
	 */
	SocialJunk.prototype.loadTwitterLibrary = function () {

		this.loadLibrary( 'https://platform.twitter.com/widgets.js', 'twitter-wjs', this.twitterEvents );

	};

	/**
	 * Creates twttr window object. Used for callbacks and events.
	 */
	SocialJunk.prototype.createTwitterObject = function () {

		window.twttr = window.twttr || {};
		window.twttr._e = [];
		window.twttr.ready = function ( callback ) {
			window.twttr._e.push( callback );
		};

	};

	/**
	 * Bind to Twitter library events, dispatch custom loaded and rendered events.
	 *
	 * @uses window.twttr
	 * @see  https://dev.twitter.com/web/javascript/events
	 */
	SocialJunk.prototype.bindTwttrEvents = function () {

		window.twttr.ready( function ( twttr ) {

			var loaded = new Event( 'twitter:loaded' ),
				rendered = new Event( 'twitter:rendered' );

			twttr.events.bind( 'loaded', function ( event ) {
				loaded.loaded = event.widgets;
				document.dispatchEvent( loaded );
			} );

			twttr.events.bind( 'rendered', function ( event ) {
				rendered.rendered = event.target;
				document.dispatchEvent( rendered );
			} );

		} );

	};

	/**
	 * Dispatch Twitter loaded event.
	 */
	SocialJunk.prototype.twitterEvents = function () {

		var loaded = new Event( 'twitter:libraryLoaded' );

		document.dispatchEvent( loaded );

	};

	return SocialJunk;

} ) );