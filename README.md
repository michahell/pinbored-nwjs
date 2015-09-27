![Pinbored](http://powergeek.nl/static-imgs/pinbored-logo-github.png)

<!-- [![David](https://img.shields.io/david/michahell/pinbored-webkit.svg)]() -->
[![devDependency Status](https://david-dm.org/michahell/pinbored-webkit/dev-status.svg)](https://david-dm.org/michahell/pinbored-webkit/#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/michahell/pinbored-webkit/badges/gpa.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)
[![Codacy Badge](https://www.codacy.com/project/badge/8c9342d436414724bee17f6ab6f5076f)](https://www.codacy.com/app/maggelo/pinbored-webkit)
[![Test Coverage](https://codeclimate.com/github/michahell/pinbored-webkit/badges/coverage.svg)](https://codeclimate.com/github/michahell/pinbored-webkit)
[![GitHub issues](https://img.shields.io/github/issues/michahell/pinbored-webkit.svg)]()

[![GitHub release](https://img.shields.io/github/release/michahell/pinbored-webkit.svg)]()
[![GitHub license](https://img.shields.io/github/license/michahell/pinbored-webkit.svg)]()

[![Stories in Ready](https://badge.waffle.io/michahell/pinbored-webkit.png?label=In%20Progress&title=In%20Progress)](https://waffle.io/michahell/pinbored-webkit)
[![Gitter](https://badges.gitter.im/JoinChat.svg)](https://gitter.im/michahell/pinbored-webkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Flattr me](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=michahell&url=https://github.com/michahell/pinbored-webkit&title=pinbored-webkit&language=english&tags=github&category=software)

[Pinbored](http://michahell.github.io/pinbored-webkit) is a 'native' [Pinboard](https://pinboard.in/) client application built with Node-webkit and AngularJS. Currently only OSX binaries are offered, but that is only because I use OSX myself and have not yet started building on other OSes. See the [abandoned AS3 client version](https://github.com/michahell/pinbored) for more info on the history of this project.

features / functionality
------------------------

**SUPPORTED**

* **Bookmarks**
  * *currently:* update, delete, browse, (full-text) search, stale checking.
  * *planned:* create.
  
* **Tags**
  * *currently:* update, delete, browse, fold.
  * *planned:* create, search, fake tag hierarchy.

* **Search**
  * *currently:* full-text, tagname, switch between OR/AND search.
  * *planned:* fake tag hierarchy.

* **Batch editing**
  * *currently:* selection add tag, selection fold all tags, selection remove all tags, selection stale checking, delete selection.
  * *planned:* selection delete all tags, make selection public/private, share selection.

**NOT YET SUPPORTED**

* **Note(s)**
  * *currently*: NONE.
  * *planned:* create, update, delete, search.

* **Full collection stale checking**
  * *currently*: NONE.
  * *planned:* stale check your whole bookmark collection!


Fake tag hierarchy explanation
------------------------------

In most (bookmarking) applications, a collection of items is either a flat list or a hierarchical structure (usually a tree, like in your operating systems file browser). However, we can stick to a naming convention for naming tags such that we are able to parse that structure and construct a hierarchy from it. Say we would like the following hierarchy:

* programming (main tag)
  * tooling
  * talks

We could then name our tags like so: *programming*, *programming.tooling* and *programming.talks*. Similarly we could use **/**, **>**, **-**, **_** or some other **hierarchy denotation symbol**.

Why
---

Why use a separate bookmark service to manage bookmarks? I have < insert browser > for that?

* Access bookmarks across multiple browsers.
* Independant of browser crashes, sudden loss of all bookmarks, malware.
* Being sure that no google, mozilla or microsoft are using your bookmarks for whatever.

There are several apps that already do this but they are either commercial software or did not have the simple features that i want them to have.

For bookmark creation consider using:

* Shiori: http://aki-null.net/shiori/ or just: ```brew cask install shiori```
* browser dependant plugins or widgets.

I WILL add bookmark creation functionality in a later version, however this was never the intention of this app.
The app is aimed at **managing** one's bookmarks, for example after a switch from < insert browser >
to Pinboard with some 1000 unmanageable bookmarks. There appear to be users with 40.000 bookmarks. Yes. 40K bookmarks.
I wish to create something to allow for managing such a huge amount of bookmarks, even though that is not my own usecase.

Screenshots
-----------

Can be seen on [the project page](http://michahell.github.io/pinbored-webkit/#screenshots).

Download
--------

Downloads are available on the [project page](http://michahell.github.io/pinbored-webkit/#binary-downloads) or from the GH [releases page](https://github.com/michahell/pinbored-webkit/releases).


Building + running from source
==============================

requirements
------------

* [Node.js and NPM](http://nodejs.org/)

* Global npm installs of: 
  * [Grunt](http://gruntjs.com/) : ```npm install -g grunt-cli```, 
  * [Bower](http://bower.io/) : ```npm install -g bower```,
  * [Jasmine](http://jasmine.github.io/) : ```npm install -g jasmine```

* Node-webkit:
  
  **- OSX users**: ```brew cask install nwjs```. or install [manually](https://github.com/nwjs/nw.js).
  optionally add an alias to your .bashrc, .bash_profile or .aliases file:

  ```bash
  # alias to nw
  alias nw="/Applications/nwjs.app/Contents/MacOS/nwjs"
  ```

  **- Windows users**: install [manually](https://github.com/nwjs/nw.js).
  I've found that it is easiest to put the extracted nwjs folder next to the pinbored dir, and
  running nwjs from there like so: ```./nw ../pinbored-webkit/App```.

  **- Linux users**: install [manually](https://github.com/nwjs/nw.js) as well.
  Optionally add an alias [like is done here](http://exponential.io/blog/install-node-webkit-on-ubuntu-linux/).

* Some patience! (the ```npm install``` command in the steps below can take quite a while to finish. Among others this is due to the nodewebkit module being downloaded by [karma-nodewebkit-launcher](https://www.npmjs.org/package/karma-nodewebkit-launcher) which needs it to be able to test using node webkit).

steps
-----

1. clone or fork project.
2. run **```npm install```** in the project root (installs development environment dependancies)
3. run **```npm install```** in /App (installs app dependancies)
4. run either:
    * **```grunt update```**
      
      **- Windows / Linux users**: if you get missing package errors, you should probably manually install the following npm packages:
    
      ```bash
      npm install grunt
      npm install grunt-purifycss
      npm install grunt-contrib-cssmin
      npm install grunt-preprocess
      npm install grunt-contrib-uglify
      npm install grunt-contrib-copy
      npm install grunt-htmlclean
      npm install grunt-karma
      npm install grunt-open
      npm install grunt-nw-builder
      ```

      and then: ```nw App``` for running the debug version in nwjs.

      **- Windows users**: ```./nw ../pinbored-webkit/App``` if your extracted nwjs folder lives next to the project folder.

    * or: **```grunt build```** and then either: 
      * **```nw App_release```**. This is the pinbored-webkit source css/js uglified + compacted files in the App_release dir.
        This is the version that gets packaged into a native application when a version is released.
        Do note that if you change the source code, and refresh inside node-webkit, it does not reflect changes as 
        opposed to running the debug version. you need to re-run ```grunt build``` each time!
      * **```grunt release-osx```** or [```grunt release-win```, ```grunt release-lin```]. This will output binaries
        (both 32 bits and 64 bits by default) for the platform you are on in App/Release.

*note: Windows and Linux binaries will be built every new release from now on !*

warnings & errors
-----------------

Depending on your OS and node version, you may see some of the following npm warnings.

**Ignore these warnings. They are all required npm submodule dependancies.**

* ```npm WARN engine xmlbuilder@2.2.1: wanted: {"node":"0.8.x || 0.10.x"} (current: {"node":"4.0.0","npm":"3.3.3"})```
* ```npm WARN engine xmlbuilder@2.4.4: wanted: {"node":"0.8.x || 0.10.x || 0.11.x"} (current: {"node":"4.0.0","npm":"3.3.3"})```
* node-gyp rebuild errors for certain npm modules.

I've seen the following extra warning on Windows 8.1, git bash, nodejs v4.0.0:

```bash
npm WARN peerDependencies The peer dependency jasmine-core@* included from karma-jasmine will no
npm WARN peerDependencies longer be automatically installed to fulfill the peerDependency
npm WARN peerDependencies in npm 3+. Your application will need to depend on it explicitly.
```

Also these errors.

**Ignore the following specific errors.**

```bash
Loading "grunt-karma.js" tasks...ERROR
>> Error: Cannot find module './lib'
```


Caveats and quirks
------------------
*  OSX
   * ~~On OSX ```ulimit -S -n 4096``` no longer neccesary due to the  [grunt-bowercopy](https://www.npmjs.org/package/grunt-bowercopy) task.~~
*  Windows
   * Need to manually install missing npm dependancies, see above.
*  Linux
   * ~~On Ubuntu Linux, which I used to test & build for linux, there can be some hassle getting the 'node' command to work:
   see: https://stackoverflow.com/questions/18130164/nodejs-vs-node-on-ubuntu-12-04/18130296#18130296~~
   * ~~removing the core node package using apt-get worked for me to get node and npm working together fine.~~
   * ~~Also, on Ubuntu version 14.x.x and up there is a [libudev.so.0 issue](https://www.exponential.io/blog/install-node-webkit-on-ubuntu-linux) but following the guide and thus installing node-webkit outside of npm works flawlessly.~~
   * ~~And finally, for some reason, the grunt-bowercopy task needs npm module 'esprima' on Ubuntu. Since on OSX that module is not needed, just installing it suffices: ```$ npm install esprima ```.~~


Disclaimer
==========

Additional to the WTFPL license it is important that you know and understand the following:

*all requests performed by the application to the Pinboard API are sequences of consecutive, single operation REST requests and are not transactions with rollback history like in SQL transactions. They are 'destructive operations' by nature (that means no undo). Future versions might support custom undo history and functionality.


Roadmap
=======

all milestones and issues:
* [Milestones](https://github.com/michahell/pinbored-webkit/milestones)
* [Issues](https://github.com/michahell/pinbored-webkit/issues)

milestones list:
* [current v0.0.4](https://github.com/michahell/pinbored-webkit/milestones/0.0.4%20Yellow%20Mountain)
* [next    v0.0.5](https://github.com/michahell/pinbored-webkit/milestones/0.0.5%20Green%20Wrench)
* [next    v0.0.6](https://github.com/michahell/pinbored-webkit/milestones/0.0.6%20Rebel%20Dagger)

name generator used for milestone names:
[Project Name Generator](http://online-generator.com/name-generator/project-name-generator.php)


Shit used, Acknowledgements etc.
==============================
![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl.svg)