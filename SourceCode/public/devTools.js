window.addEventListener("keydown", function(e) {
    var ref;
    let nwWin = nw.Window.get(window);
  
    switch ((ref = e.key) != null ? ref : e.keyIdentifier) {
      case "F12":
        return nwWin.showDevTools();
      case "F5":
        return nwWin.reload();
    }
  });