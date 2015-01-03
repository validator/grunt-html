# grunt-html

[Grunt][grunt] plugin for html validation, using the [vnu.jar markup checker][vnujar].

## Getting Started
Install this grunt plugin next to your project's [Gruntfile.js][getting_started] with:

```bash
npm install grunt-html --save-dev
```

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

There's a single option, `ignore` (`Array`). Use this to specify the error messages to ignore. For example:

```js
all: {
	options: {
		ignore: ['The “clear” attribute on the “br” element is obsolete. Use CSS instead.']
	},
	src: "html4.html"
}
```

The ignore array also supports regular expressions. For example, to ignore AngularJS directive attributes:

```js
all: {
	options: {
		ignore: [/attribute “ng-[a-z-]+” not allowed/]
	},
	src: "app.html"
}
```

[grunt]: http://gruntjs.com/
[getting_started]: http://gruntjs.com/getting-started
[vnujar]: https://validator.github.io/

## License
Copyright Jörn Zaefferer
Licensed under the MIT license.
