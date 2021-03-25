# Global connection object for making http requests
::Connect = Faraday.new do |conn|
  conn.request  :url_encoded
  conn.request  :retry, {max: 3, interval: 0.05}
  conn.response  :raise_error
  conn.adapter  Faraday.default_adapter
end
