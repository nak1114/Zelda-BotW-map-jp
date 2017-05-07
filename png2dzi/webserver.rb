#!ruby 
require "webrick"

  svr=WEBrick::HTTPServer.new(:DocumentRoot => "../docs", :Port => 8000)
  server_thread = Thread.new do
    svr.start
  end
  chrome='"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"'
  `#{chrome} --remote-debugging-port=9222 http://localhost:8000`
  server_thread.join
  
