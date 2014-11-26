// Copyright (c) 2014 Pruthvikar Reddy. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to prevent facebook sending seen notifications

function blockSeen(info) {
    'use strict';
    return {cancel: true};
}
  // filters
var filters = {
    urls: [
        "https://www.facebook.com/ajax/mercury/change_read_status.php",
        "https://www.facebook.com/ajax/notifications/mark_read.php",
        "https://www.facebook.com/ajax/mercury/mark_seen.php"
    ]
};
  // extraInfoSpec
var extraInfoSpec = ["blocking"];

function checkState(clicked) {
    'use strict';
    chrome.storage.sync.get('state', function (obj) {
        if (clicked ? obj.state : !obj.state) {
            chrome.browserAction.setIcon({
                path: 'icon.png'
            });
            chrome.storage.sync.set({'state': false}, function () {});
            chrome.webRequest.onBeforeRequest.removeListener(blockSeen, filters, extraInfoSpec);
        } else {
            chrome.browserAction.setIcon({
                path: 'icon-closed.png'
            });
            chrome.storage.sync.set({'state': true}, function () {});
            chrome.webRequest.onBeforeRequest.addListener(blockSeen, filters, extraInfoSpec);
        }
    });
}

checkState(false);

chrome.browserAction.onClicked.addListener(function () {
    'use strict';
    checkState(true);
});