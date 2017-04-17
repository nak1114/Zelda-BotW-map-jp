#!ruby 
require "webrick"
WEBrick::HTTPServer.new(:DocumentRoot => "../docs", :Port => 8000).start
