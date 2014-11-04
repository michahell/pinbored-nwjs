pinbored-webkit
===============

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/michahell/pinbored-webkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![devDependency Status](https://david-dm.org/michahell/pinbored-webkit/dev-status.svg)](https://david-dm.org/michahell/pinbored-webkit/#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/michahell/pinbored-webkit/badges/gpa.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)
[![Test Coverage](https://codeclimate.com/github/michahell/pinbored-webkit/badges/coverage.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)
[![Build Status](https://travis-ci.org/michahell/pinbored-webkit.svg)](https://travis-ci.org/michahell/pinbored-webkit)
[![Stories in Ready](https://badge.waffle.io/michahell/pinbored-webkit.png?label=In%20Progress&title=In%20Progress)](https://waffle.io/michahell/pinbored-webkit)

Pinbored native OSX client built with Node-webkit and AngularJS. Future plans include windows / linux
builds as well, but for now focus is on OSX (using NUWK! instead of CLI node-webkit magic for development simplification). See https://github.com/michahell/pinbored for more info of history of this project.

Download binaries
=================

* OSX:
  [v0.0.2]()
* Windows:
  [v0.0.2]()
* Linux 32 bits:
  [v0.0.2]()
* Linux 64 bits:
  [v0.0.2]()

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

i could add bookmark creation functionality in a later version, however this was never the intention of this app.
The app is aimed at **managing** one's bookmarks, for example after a switch from < insert browser >
to Pinboard with some 1000 unmanageable bookmarks.

Screenshots
===========

![login](screenshots/login.png?raw=true "login screen")
![overview](screenshots/overview-bars.png?raw=trueg "overview all bars")
![overview](screenshots/overview-bars-2.png?raw=true "overview bookmark load type")
![overview](screenshots/overview-update.png?raw=true "overview individual update")
![overview](screenshots/overview-private.png?raw=true "overview private icon")
![overview](screenshots/overview-selection.png?raw=true "overview selection")
![overview](screenshots/overview-selection-stale.png?raw=true "overview selection stale check")
![overview](screenshots/overview-tag-select.png?raw=true "overview tag selection")

Disclaimer
==========

Additional to the MIT license it is important that you know and understand the following:

*all requests performed by the application to the Pinboard API are sequences of consecutive, single operation REST requests and are not transactions with rollback history like in SQL transactions. They are 'destructive operations' by nature (that means no undo! Future versions might support custom undo history and functionality if so desired)* 

Building
========

~~On OSX, somehow the number of max-open files is by default 256. This is too little to build this project,
so one must set it to allow more. ```ulimit -S -n 4096``` allows 4096 files to be open, i have found this is
enough. This is because right now, the whole node_modules and bower_components folders are zipped into application bundles, which contain huge amounts of (unused) files.~~

*The above is no longer the case, because the HUGE amount of projectfiles created by bower are removed in a grunt build step and only the ones really used (distribution files) are needed during building, thanks to the awesome [grunt-bowercopy](https://www.npmjs.org/package/grunt-bowercopy) task!*

requirements
------------

* Node.js and NPM
* global install of Grunt and Bower (or run)

steps
-----

0. [optional] run ```npm preinstall``` to install Grunt and Bower globally, requiring your sudo password.
1. clone project somewhere
2. run ```npm install``` (installs dev. and app dependancies and bower components)
3. run ```grunt test``` (tests everything and shows jasmine report in google chrome)
1. run ```grunt build``` (for ALL application bundles) OR
2. run
    * ```grunt osx``` (for OSX application bundle)
    * ```grunt win``` (for Windows application bundle)
    * ```grunt lin32``` (for Linux 32 bits application bundle)
    * ```grunt lin64``` (for Linux 64 bits application bundle)

npm test isn't used since the same gruntfile is used for Travis, which cannot build node-webkit headlessly (yet).

Roadmap
=======

* [Milestone V 0.0.1](https://github.com/michahell/pinbored-webkit/milestones/0.0.1%20Iron%20Orchid)
* [Milestone V 0.0.2](https://github.com/michahell/pinbored-webkit/milestones/0.0.2%20Tin%20Thistle)
* [Milestone V 0.0.3](https://github.com/michahell/pinbored-webkit/milestones/0.0.3%20Gold%20Dahlia)

