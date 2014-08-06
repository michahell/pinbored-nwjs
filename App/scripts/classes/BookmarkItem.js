

function BookmarkItem (data) {

  // pinboard fields
  this.title = "no title set.";
  this.description = "no description set.";
  this.extended = "no extended description set.";
  this.hash = "no hash set.";
  this.href = "no href set.";
  this.meta = "no meta set.";
  this.tags = "no tags set.";
  this.toread = false;
  this.shared = false;

  // kustom fields
  this.urlChecked = false;

  // build item
  for (var field in data) {
    if(this.hasOwnProperty(field)) {
      this[field] = data[field];
    }
  }

}