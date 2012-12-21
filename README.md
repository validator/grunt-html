# grunt-html

[Grunt][grunt] plugin for html validation, using [Mike Smith's vnu.jar][vnujar].

## Getting Started
Install this grunt plugin next to your project's [Gruntfile.js gruntfile][getting_started] with: `npm install grunt-html --save-dev`

Then add this line to your project's `Gruntfile.js`:

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

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[vnujar]: https://bitbucket.org/sideshowbarker/vnu/

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
