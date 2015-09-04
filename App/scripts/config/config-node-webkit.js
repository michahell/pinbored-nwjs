
// catch node-webkit errors globally
// process.on('uncaughtException', function(e) {
//   console.info('NODE WEBKIT ERROR!', e);
// });


$(function() {
  
  function Menu(cutLabel, copyLabel, pasteLabel) {
    
    var gui = require('nw.gui'),
        menu = new gui.Menu();

    var cut = new gui.MenuItem({label: cutLabel || 'Cut', click: function() {
        document.execCommand('cut');
        console.log('Menu:', 'cutted to clipboard');
      }
    });

    var copy = new gui.MenuItem({label: copyLabel || 'Copy' , click: function() {
        document.execCommand('copy');
        console.log('Menu:', 'copied to clipboard');
      }
    });

    var paste = new gui.MenuItem({label: pasteLabel || 'Paste', click: function() {
        document.execCommand('paste');
        console.log('Menu:', 'pasted to textarea');
      }
    });

    menu.append(cut);
    menu.append(copy);
    menu.append(paste);

    return menu;
  };

  function fixQuirks() {
    
    var fixBackspace = function () {
      $(document).on('keydown', function (e) {
        if (e.which === 8 && !$(e.target).is("input, textarea")) {
          e.preventDefault();
        }
      });
    };

    var fixCopyPaste = function () {
      var gui = window.require('nw.gui');

      var mb = new gui.Menu({type: 'menubar'});
      mb.createMacBuiltin('pinbored');
      gui.Window.get().menu = mb;
    };

    fixBackspace();
    fixCopyPaste();
  };

  var menu = new Menu(/* pass cut, copy, paste labels if you need i18n*/);

  fixQuirks();
  console.info('app config :: quirks fixed!');

  $(document).on('contextmenu', function(e) {
    e.preventDefault();
    menu.popup(e.originalEvent.x, e.originalEvent.y);
  });
  
});