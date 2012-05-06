# grunt-html

[Grunt][grunt] plugin for html validation, using [Mike Smith's vnu.jar][vnujar].

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-html`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-html');
```


### Validation
Specify what files to validate in your config:

```javascript
grunt.initConfig({
	htmllint: {
		all: ["demos/**/*.html", "tests/**/*.html"]
	}
});
```

For fast validation, keep that in a single group, as the validator initialization takes a few seconds.

### Minification
Specify what files to minify in your config:

```javascript
grunt.initConfig({
    htmlmin: {
        dist: {
            src: ["src/**/*.html"],
            dest: "build"
        }
    }
});
```

This task behaves a bit different than the js minifier task that comes
with grunt. Instead of defining a destination file, you define a destination
directory where all of the found source files will be stored in their minified
form.

Additionally, define options for your minification task
(if you don´t specify any options, nothing will happen to your files...)

A detailed description for each option can be found [here](http://perfectionkills.com/experimenting-with-html-minifier/#options)

```javascript
grunt.initConfig({
    htmlmin: {
        dist: {
            src: ["src/**/*.html"],
            dest: "build"
        }
    },

    htmlminifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true, 
      removeOptionalTags: true
    }	
});
```


[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
[vnujar]: https://bitbucket.org/sideshowbarker/vnu/
[html-min]: https://github.com/kangax/html-minifier

## Release History
* 0.1.1 Rename html task to htmllint, fixes #1
* 0.1.0 First Release

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
