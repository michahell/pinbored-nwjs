contribute / version bump
-------------------------

**NEW VERSION RELEASE**

* **Run testsuite.** ```grunt test```

* **1) Run and test nw /App.** 
  * ```grunt update```
  * ```nw /App``` (check for obvious runtime bugs, issues)

* **2) Run and test nw /App_release.**
  * ```grunt build```
  * ```nw /App_release``` (check for obvious runtime bugs, issues)

* **3) Fire up Linux + Winblows virtual box machines.**
  * ```git pull``` or ```git clone``` (update repo's or delete and do a fresh git close)
  * repeat the above steps for each OS target
  * and run ```grunt release-win``` or ```release-lin```.
  * copy the binaries from the ```Release``` folder to main OS for easier upload later

* **optional) Pull request ?**
  * woohoo! thanks fo yo contrib, dawg!

* **4) Release the kraken!**
  * create a new annotated tag: ```git tag -a <version number> -m "Pinbored-nwjs release version <version number> : <version name>."
  * go to https://github.com/michahell/pinbored-nwjs/releases
  * draft a new release, select the newly created tag, add a link to the (not closed) version milestone.
  * upload the different OS target binaries
  * hit publish release!