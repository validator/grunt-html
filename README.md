# grunt-html

[![Linux Build Status](https://img.shields.io/travis/validator/grunt-html/master.svg?label=Linux%20build)](https://travis-ci.org/validator/grunt-html)
[![Windows Build status](https://img.shields.io/appveyor/ci/sideshowbarker/grunt-html/master.svg?label=Windows%20build)](https://ci.appveyor.com/project/sideshowbarker/grunt-html/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/github/validator/grunt-html.svg)](https://coveralls.io/github/validator/grunt-html)
[![dependencies Status](https://img.shields.io/david/validator/grunt-html.svg)](https://david-dm.org/validator/grunt-html)
[![devDependencies Status](https://img.shields.io/david/dev/validator/grunt-html.svg)](https://david-dm.org/validator/grunt-html?type=dev)

[Grunt][grunt] plugin for HTML validation, using the [Nu Html Checker (v.Nu)][vnujar].

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
    all: ['demos/**/*.html', 'tests/**/*.html']
  }
});
```

For fast validation, keep that in a single group, as the validator initialization takes a few seconds.

When combined with a watching task (such as [grunt-contrib-watch][watch]), even faster validation can be achieved by starting the validator in client mode and connecting to an already-running instance of the validator in server mode. This removes the time required by repeated initializations. See the `server` option below.

## Options

### `ignore`

* Type: `Array`, `String`, or `RegExp`
* Default: `null`

Use this to specify the error message(s) to ignore. For example:

```js
all: {
  options: {
    ignore: 'The “clear” attribute on the “br” element is obsolete. Use CSS instead.'
  },
  src: 'html4.html'
}
```

The `ignore` option also supports regular expressions. For example, to ignore AngularJS directive attributes:

```js
all: {
  options: {
    ignore: /attribute “ng-[a-z-]+” not allowed/
  },
  src: 'app.html'
}
```

### `server`

* Type: `Object`, or a falsy value
* Default: `false`

When `server` is set to a falsy value, the validator is invoked using `java -jar`, which can be considered normal operation.

Set `server` to an object to start the validator in client mode and connect to an already-running instance of the validator in server mode.
To start the validator in server mode, use `java -cp "path/to/vnu.jar" nu.validator.servlet.Main <port>`.

```js
all: {
  options: {
    // connect to a validator instance running in server mode on localhost:8888
    server: {}
  },
  src: 'app.html'
}
```

The `server` object also accepts the `host` and `port` keys, specifying the location of the server.

```js
all: {
  options: {
    server: {
      // your team's local dev tool machine, for example
      host: '192.168.0.5',
      port: 8877
    }
  },
  src: 'app.html'
}
```

The following configuration in Gruntfile.js uses [grunt-vnuserver][vnuserver] to start the validator in server mode and sets up a watch task to run `htmllint` every time the source file changes.
By starting the validator in server mode once using the `vnuserver` task, validations by `htmllint` can be performed much faster by simply connecting to this already-running server.

```js
module.exports = function (grunt) {
  grunt.initConfig({
    vnuserver: {
    },
    htmllint: {
      all: {
        options: {
          server: {}
        },
        src: 'app.html'
      }
    },
    watch: {
      all: {
        tasks: ['htmllint'],
        files: 'app.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-vnuserver');
  grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['vnuserver', 'watch']);
};
```

### `errorlevels`

* Type: `Array`
* Default: `'info','warning','error'`

Set `errorlevels` to control which error types are returned from the validator. Ignores all other returned types.

### `force`

* Type: `Boolean`
* Default: `false`

Set `force` to `true` to report errors but not fail the `grunt` task.

### `reporter`

* Type: `String`
* Default: `null`

Allows you to modify the output format. By default, this plugin will use a built-in Grunt reporter. Set the path to your own custom reporter or to one of the provided reporters: `checkstyle`, `junit` or `json`.

### `reporterOutput`

* Type: `String`
* Default: `null`

Specify a filepath to output the results of a reporter. If `reporterOutput` is specified then all output will be written to the given filepath rather than printed to `stdout`.

### `absoluteFilePathsForReporter`

* Type: `Boolean`
* Default: `false`

Set `absoluteFilePathsForReporter` to `true` to use absolute file paths in generated reports.

### `noLangDetect`

* Type: `Boolean`
* Default: `false`

Set `noLangDetect` to `true` to [skip the checking of the language of the page](https://github.com/validator/validator#--no-langdetect).

## Potential pitfalls

* vnu.jar requires Java 8 environment or up.

## License

Copyright Jörn Zaefferer.  
Licensed under the [MIT license](LICENSE).

[grunt]: https://gruntjs.com/
[getting_started]: https://gruntjs.com/getting-started
[vnujar]: https://validator.github.io/validator/
[watch]: https://github.com/gruntjs/grunt-contrib-watch
[vnuserver]: https://www.npmjs.com/package/grunt-vnuserver
