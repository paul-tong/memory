// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

import game_init from "./demo";

function init() {
  let root = document.getElementById('root');
  if (root) {
    let channel = socket.channel("games:" + window.gameName, {});
    game_init(root, channel);

    // back to index page
    $('#logout').click(() => {
      var curWwwPath=window.document.location.href;
      var pathName=window.document.location.pathname;
      var pos=curWwwPath.indexOf(pathName);
      var localhostPath=curWwwPath.substring(0,pos);
      window.location = localhostPath;
    });	
  }

  // go to game page
  if (document.getElementById('game-button')) {
    $('#game-button').click(() => {
      let name = $('#game-input').val();
      let url = '/game/' + name;
      window.location = url;
    });	
  }
}

// Use jQuery to delay until page loaded.
$(init);

