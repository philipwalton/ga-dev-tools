# Copyright 2014 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import webapp2
from lib.controllers.base import BaseController
import lib.template as template

import logging

def constructGaUrl(ga_query_param, acct_id):
  url_hash = ga_query_param.replace('ACCOUNT_ID', acct_id)
  full_ga_url = 'http://www.google.com/analytics/web#' + url_hash
  return str(full_ga_url)

class DeepLinkerRedirectController(webapp2.RequestHandler):
  def get(self):
  	ga_query_param = self.request.get('ga')
  	acct_id = self.request.get('acct')
  	full_ga_url = constructGaUrl(ga_query_param, acct_id)
  	self.redirect(full_ga_url)

class DeepLinkerLandingPageController(BaseController):
  def get(self):
    if('dl' in self.request.cookies and self.request.get('ga') is not ''):
      ga_query_param = self.request.get('ga')
      acct_id = self.request.cookies['dl']
      full_ga_url = constructGaUrl(ga_query_param, acct_id)
      self.redirect(full_ga_url)
    elif(self.request.get('ga') is not ''):
      title = self.request.get('title')
      titleOverwrite = "Redirecting to" + \
        ("\"" + title + "\"" if title else "Google Analytics")
      #title = self.request.get('title')
      #titleOverwrite = "Select view to be redirected to " + \
      #("\"" + title + "\"" if title else "Google Analytics")
      #params = {
      #  "nosidebar": True, 
      #  "description": False,
      #  "searchBox": True,
       # "titleOverwrite": titleOverwrite
       # }

      params = {"titleOverwrite": titleOverwrite}
      html = template.render("deeplinker", "redirect", params)
      self.response.write(html)
      #super(DeepLinkerLandingPageController, self).get("deeplinker", "redirect")
    elif('dl' in self.request.cookies):
      params = {
        "description": True,
        "searchBox": False, 
        "showSelection": self.request.cookies['dl']
        }
      html = template.render("deeplinker", "index", params)
      self.response.write(html)
    else:
      params = {
        "description": True,
        "searchBox": False
        }
      html = template.render("deeplinker", "index", params)
      self.response.write(html)
