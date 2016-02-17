contribute / version bump
-------------------------

**NEW VERSION RELEASE**

* **1) Run testsuite** 
  * ```grunt test``` (and apply volkswagen fixes where neccesary)

* **2) Run and test nw /App** 
  * ```grunt update```
  * ```nw /App``` (check for obvious runtime bugs, issues)

* **3) Run and test nw /App_release**
  * ```grunt build```
  * ```nw /App_release``` (check for obvious runtime bugs, issues)

* **4) Fire up Linux + Winblows virtual box machines**
  * ```git clone https://github.com/michahell/pinbored-nwjs.git``` (do a fresh git clone)
  * follow the project setup steps (to test fresh project setup steps), npm install etc. etc.
  * repeat the above steps for each OS target to test for OS specific quirks.
  * run ```grunt release-win``` or ```release-lin```.
  * test if the binaries work (navigate to folder and start executables).
  * zip the folders for each bitness OS target (x32 and x64) if applicable.
  * copy the binary zipfiles from the ```Release``` folder to main OS for easier upload later.

* **5) Release on github**
  * first, update the package.json versions in ```/``` and in ```/App``` to the just closed milestone version.
  * create a new annotated tag: ```git tag -a <version number> -m "Pinbored-nwjs release version <version number> : <version name>."
  * go to https://github.com/michahell/pinbored-nwjs/releases
  * draft a new release, select the newly created tag, add a link to the (not closed) version milestone.
  * upload the different OS target binaries
  * hit publish release!

* **6) Close the version milestone and create a new one**
  * go to https://github.com/michahell/pinbored-nwjs/milestones/new
  * close the milestone, create a new one using this name generator: http://www.codenamegenerator.com/
  * update the README.md roadmap section