// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/* global gapi */
var accountSummaries = require('javascript-api-utils/lib/account-summaries');
var Cookies = require('cookies-js');

function setup() {
  if(getParameterByName('ga') == '') {
      if(Cookies.get('dl')) {
        $('#current-selection').show();
        accountSummaries.get().then(function(summaries) {
          var viewId = Cookies.get('dl').split('p')[1];
          var profile = summaries.getProfile(viewId);
          var property = summaries.getWebPropertyByProfileId(viewId);
          var account = summaries.getAccountByViewId(viewId);
          $('#account-selection-name').text('Account: ' + account.name);
          $('#property-selection-name').text('Property: ' + property.name);
          $('#view-selection-name').text('View: ' + profile.name);
        });
        $('#remove-selection').click(function() {
          // set to expiration date before today to remove
          Cookies.set('dl', '', { expires: '01/01/2012' });

        })

    }
  }
  else {
    // add warning about app profile
    if(getParameterByName('ga').indexOf('app') > -1) {
      $('#error').text('Note: This link is for an App View. Select an App View for best results.')
    }
    accountSummaries.get().then(function(summaries) {
      setViewSelector(summaries);
    });
  }
}

/**
 * Creates and sets the viewSelector
 * @param {Object} summaries The account summaries response.
 * @param {String} viewId The view ID to set the viewSelector to
 */
function setViewSelector(summaries, viewId) {
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
   container: 'view-selector-container'
  }).execute();
  viewSelector.set({viewId: viewId});

  $('#view-selector-submit').click(function() {
    // check if use always is selected, if so set a cookie to remember preference
    if($('#use-always-check').prop('checked')) {
      Cookies.set('dl', getAccountString());
    }
    // get view selector values and redirect to /r
    var redirectUrl = '/r?ga=' + getParameterByName('ga') + '&acct=' + getAccountString();
    document.location = redirectUrl;

    function getAccountString() {
      var accountString = 'a' + viewSelector.account.id + 'w' + 
      viewSelector.property.internalWebPropertyId + 'p' + viewSelector.view.id;
      return accountString;
    }
  });
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : results[1].replace(/\+/g, ' ');
}


module.exports = {
  init: function() {
    gapi.analytics.ready(function() {
      if (gapi.analytics.auth.isAuthorized()) {
        setup();
      }
      else {
        gapi.analytics.auth.once('success', setup);
      }
    });
  }
};
