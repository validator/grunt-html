# grunt-html

[Grunt][grunt] plugin for html validation, using [Mike Smith's vnu.jar][vnujar].

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-html`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-html');
```

Then specify what files to validate in your config:

```javascript
grunt.initConfig({
	htmllint: {
		all: ["demos/**/*.html", "tests/**/*.html"]
	}
});
```

For fast validation, keep that in a single group, as the validator initialization takes a few seconds.

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
[vnujar]: https://bitbucket.org/sideshowbarker/vnu/

## Release History
* 0.1.1 Rename html task to htmllint, fixes #1
* 0.1.0 First Release

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
