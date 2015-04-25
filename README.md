pinbored-webkit
===============

![Pinbored](http://powergeek.nl/static-imgs/pinbored-logo-github.png)

[![Stories in Ready](https://badge.waffle.io/michahell/pinbored-webkit.png?label=In%20Progress&title=In%20Progress)](https://waffle.io/michahell/pinbored-webkit)
[![devDependency Status](https://david-dm.org/michahell/pinbored-webkit/dev-status.svg)](https://david-dm.org/michahell/pinbored-webkit/#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/michahell/pinbored-webkit/badges/gpa.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)
[![Test Coverage](https://codeclimate.com/github/michahell/pinbored-webkit/badges/coverage.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)

[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/michahell/pinbored-webkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Flattr me](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=michahell&url=https://github.com/michahell/pinbored-webkit&title=pinbored-webkit&language=english&tags=github&category=software)

[Pinbored](http://michahell.github.io/pinbored-webkit) is a 'native' [Pinboard](https://pinboard.in/) client application built with Node-webkit and AngularJS. Currently only OSX binaries are offered, but that is only because I use OSX myself and have not yet started building on other OSes. See the [abandoned AS3 client version](https://github.com/michahell/pinbored) for more info on the history of this project.

Why
===

Why use a separate bookmark service to manage bookmarks? I have < insert browser > for that?

* Access bookmarks across multiple browsers.
* Independant of browser crashes, sudden loss of all bookmarks, malware.
* Being sure that no google, mozilla or microsoft are using your bookmarks for whatever.

There are several apps that already do this but they are either commercial software or did not have the simple features that i want them to have.

For bookmark creation consider using:

* Shiori: http://aki-null.net/shiori/ or just: ```brew cask install shiori```
* browser dependant plugins or widgets.

I could add bookmark creation functionality in a later version, however this was never the intention of this app.
The app is aimed at **managing** one's bookmarks, for example after a switch from < insert browser >
to Pinboard with some 1000 unmanageable bookmarks.

Screenshots
===========

Can be seen on the project page: http://michahell.github.io/pinbored-webkit/#screenshots

Download binaries
=================

Can be downloaded on the project page:  http://michahell.github.io/pinbored-webkit/#binary-downloads

Running from source
===================

If you have node-webkit installed, you can use the following pseudo command in the root of the project dir to just run the app using the latest version:
```
$ <node-webkit executable location> App/
```

Or, if you have the **nw** alias configured:

```
$ nw /App
```

Building from source
====================

~~On OSX, somehow the number of max-open files is by default 256. This is too little to build this project,
so one must set it to allow more. ```ulimit -S -n 4096``` allows 4096 files to be open, i have found this is
enough. This is because right now, the whole node_modules and bower_components folders are zipped into application bundles, which contain huge amounts of (unused) files.~~

*The above is no longer the case, because the HUGE amount of projectfiles created by bower are removed in a grunt build step and only the ones really used (distribution files) are needed during building, thanks to the awesome [grunt-bowercopy](https://www.npmjs.org/package/grunt-bowercopy) task!*

requirements
------------

* [Node.js and NPM](http://nodejs.org/)
* Global install of [Grunt](http://gruntjs.com/), [Bower](http://bower.io/).
* Some patience! the ```npm install``` command can take quite a while to finish. Among others this is due to the nodewebkit module being downloaded by [karma-nodewebkit-launcher](https://www.npmjs.org/package/karma-nodewebkit-launcher) which needs it to be able to test using node webkit.

steps
-----

1. clone project somewhere, doesn't matter where.
2. run ```npm install``` (installs dev. and app dependancies and bower components)
3. run ```grunt test``` (tests everything and shows jasmine report in google chrome)
4. run:
    * ```grunt build``` (build for ALL platforms, **untested**) OR
    * ```grunt osx``` (for OSX application bundle)
    * ```grunt win``` (for Windows application bundle, **untested**)
    * ```grunt lin32``` (for Linux 32 bits application bundle, **being tested**)
    * ```grunt lin64``` (for Linux 64 bits application bundle, **untested**)

npm test isn't used since the same gruntfile is used for Travis, which cannot build node-webkit headlessly (yet).

(possible) caveats
------------------
* On Ubuntu Linux, which I use to test & build for linux, there can be some hassle getting the 'node' command to work:
 see: https://stackoverflow.com/questions/18130164/nodejs-vs-node-on-ubuntu-12-04/18130296#18130296
* removing the core node package using apt-get worked for me to get node and npm working together fine.
* Also, on Ubuntu version 14.x.x and up there is a [libudev.so.0 issue](https://www.exponential.io/blog/install-node-webkit-on-ubuntu-linux) but following the guide and thus installing node-webkit outside of npm works flawlessly.
* And finally, for some reason, the grunt-bowercopy task needs npm module 'esprima' on Ubuntu. Since on OSX that module is not needed, just installing it suffices: ```$ npm install esprima ```.

Disclaimer
==========

Additional to the MIT license it is important that you know and understand the following:

*all requests performed by the application to the Pinboard API are sequences of consecutive, single operation REST requests and are not transactions with rollback history like in SQL transactions. They are 'destructive operations' by nature (that means no undo! Future versions might support custom undo history and functionality if so desired)* 

Roadmap
=======

[Milestones](https://github.com/michahell/pinbored-webkit/milestones) orrrrr
the awesome waffle.io version: [awesome waffle.io scrum board](https://waffle.io/michahell/pinbored-webkit)
=======
Roadmap
=======

* [Milestone V 0.0.1](https://github.com/michahell/pinbored-webkit/milestones/0.0.1%20Iron%20Orchid)
* [Milestone V 0.0.2](https://github.com/michahell/pinbored-webkit/milestones/0.0.2%20Tin%20Thistle)
* [Milestone V 0.0.3](https://github.com/michahell/pinbored-webkit/milestones/0.0.3%20Gold%20Dahlia)
