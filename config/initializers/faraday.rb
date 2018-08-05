# Global connection object for making http requests
::Connect = Faraday.new do |conn|
  conn.request  :url_encoded
  conn.adapter  Faraday.default_adapter
end
