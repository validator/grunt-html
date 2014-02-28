# grunt-html

[Grunt][grunt] plugin for html validation, using [Mike Smith's vnu.jar][vnujar].

## Getting Started
Install this grunt plugin next to your project's [Gruntfile.js gruntfile][getting_started] with: `npm install grunt-html --save-dev`

Then add this line to your project's `Gruntfile.js`:

```js
grunt.loadNpmTasks('grunt-html');
```

Then specify what files to validate in your config:

```js
grunt.initConfig({
	htmllint: {
		all: ["demos/**/*.html", "tests/**/*.html"]
	}
});
```

For fast validation, keep that in a single group, as the validator initialization takes a few seconds.

## Options

There's a single option, `ignore`. Use this to specify the error messages to ignore. For example:

```js
ignore: {
	options: {
		ignore: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.'
	},
	src: "html4.html"
}
```

[grunt]: http://gruntjs.com/
[getting_started]: http://gruntjs.com/getting-started
[vnujar]: https://github.com/validator/validator.github.io

## License
Copyright (c) 2014 Jörn Zaefferer
Licensed under the MIT license.
