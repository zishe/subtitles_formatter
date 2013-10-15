AngularJS app with Yeoman!
==========================

Hi, I'm interested in **AngularJS** recently and I have to confront with bunch of problems, even in such simple things like working app, automatically created by **Yeoman**.

I use the latest versions of `Grunt 0.4.1`, `AngularJS 1.2.0-rc.3`, `Twitter Bootstrap 3.0.0` with `SASS` language (I guess it's popular stack in this case).

The source code you can find on **Github** [yeoman-angular-bootstrap-app](https://github.com/zishe/yeoman-angular-bootstrap-app)

It's just my method to learn solving problems and writing on English, so I think you could just clone ready app and start working with it.

#### Why not CoffeeScript?

 I decided to not use **CoffeeScript** for several reasons:

- Angular is more oriented to *JS*:
 - classes are rarely used, for which *Coffee* is more elegant;
 - some structures like promises are inconvenient to use them in *Coffee* (maybe it's my problem);
 - And the most important, errors traced more easily, because a browser executes js code.
- I moved to *Coffee* with a weak knowledge of **JavaScript**, so possibly it will increase my *JS* skills, which perhaps be useful for work.
- *JS* still more popular, and *Coffee* mostly using with *Rails*. It effects when you asking a question an *StackOverflow*, or using someones code (and I do it extremely often)

Certainly *Coffee* has a lot of cool features, it's shorter, more elegant (like ruby) and maybe lately I'll move to it.

### Creating App

I'll be translated creating *Angular* app in this way. By the way, I'm using *OS X*, but i guess it has no difference.

```
sudo npm install -g yo grunt grunt-cli bower generator-angular
```
If you didn't install them yet.
```
mkdir my-app
cd myapp
yo angular
```
I chose always `Yes` and wait about 30(!) seconds. So, app has created, start to configure it. By the way, you can check that it works with `grunt server` command (works for me:)).

#### Bower

Go to `bower.json` and see installed outdated packages, I prefer the newest (it make sense in *Angular* case, but not sure about other).
```
{
  "name": "yeomanAngularBootstrapApp",
  "version": "0.0.0",
  "dependencies": {
    "angular": "~1.0.7",
    "json3": "~3.2.4",
    "jquery": "~1.9.1",
    "bootstrap-sass": "~2.3.1",
    "es5-shim": "~2.0.8",
    "angular-resource": "~1.0.7",
    "angular-cookies": "~1.0.7",
    "angular-sanitize": "~1.0.7"
  },
  "devDependencies": {
    "angular-mocks": "~1.0.7",
    "angular-scenario": "~1.0.7"
  }
}
```

I changed to:

```
{
  "name": "yeomanAngularBootstrapApp",
  "version": "0.0.0",
  "dependencies": {
    "angular": "*",
    "json3": "*",
    "jquery": "*",
    "bootstrap-sass": "*",
    "es5-shim": "*",
    "angular-route": ">=1.2.0-rc",
    "angular-resource": ">=1.2.0-rc",
    "angular-cookies": ">=1.2.0-rc",
    "angular-sanitize": ">=1.2.0-rc"
  },
  "devDependencies": {
    "angular-mocks": ">=1.2.0-rc",
    "angular-scenario": ">=1.2.0-rc"
  }
}
```

```
bower update
grunt server
```
#### Bootstrap

And I see a blank page with `Invalid US-ASCII character "\xE2"` text. There is a bug https://github.com/jlong/sass-bootstrap/pull/103 that already merged, but still not released. So, I found guilty symbol `—` (long hyphen) in `app/bower_components/bootstrap-sass/_grid.scss` and replace it on usual hyphen.

Also, glyphicon wouldn't works with that path, we should change variable `$icon-font-path` in file `app/bootstrap-sass/lib/variables.scss` to:

```
$icon-font-path:          "/bower_components/bootstrap-sass/fonts/" !default;
```
Such kludges will disappear with bower update, so you have to be careful with it.

Again
```
grunt server
```

#### Angular-route

And see a lot of errors such

```
Failed to load resource: the server responded with a status of 404 (Not Found)
http://localhost:9000/bower_components/bootstrap-sass/js/bootstrap-affix.js
```
Which easily healed by changing names to correct `bootstrap-affix` -> `affix` and removing 'typeahead' that I guess was extracted to separate project. By the way `popover.js` doesn't load, and I couldn't figured out why. But I just comment all this scripts, until there is no need in them.

And the last error:
```
Uncaught Error: [$injector:modulerr] Failed to instantiate module yeomanAngularBootstrapAppApp due to:
Error: [$injector:unpr] Unknown provider: $routeProvider
http://errors.angularjs.org/1.2.0-rc.3/$injector/unpr?p0=%24routeProvider
```
It's because we should add `angular-route.js` file to `app/index.html` with other Angular modules:
```
        <script src="bower_components/angular-route/angular-route.js"></script>
        <script src="bower_components/angular-resource/angular-resource.js"></script>
        <script src="bower_components/angular-cookies/angular-cookies.js"></script>
        <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
```
And include this module in out app:
```
angular.module('yeomanAngularBootstrapAppApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
```
Now it works.

#### Configure html5Mode

Another thing I would like to do is add correct html5Mode routing. Because by default it's only load on root page '\'. If you change your controller page from root to any other like 'main', you will not able to load this page, only to link from another page, but reload returns `Cannot GET /main` error. This tremendously confine your application abilities. I created an issue about this https://github.com/yeoman/generator-angular/issues/383. There are 2 methods: [add `connect-modrewrite` module](https://gist.github.com/zishe/6925726) and with [this](https://github.com/yeoman/generator-angular/issues/393) magic. I stayed on First.

All we need is just add `connect-modrewrite` module.
Add to GruntFile.js at the start:
```
var modRewrite = require('connect-modrewrite');
```
And change connect part with:
```
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          hostname: '0.0.0.0',
          middleware: function (connect) {
            return [
              modRewrite([
                '!(\\..+)$ / [L]'
              ]),
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },

```
It works!

### Table of contents

[TOC]

