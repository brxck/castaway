# Global connection object for making http requests
::Connect = Faraday.new do |conn|
  conn.request  :url_encoded
  conn.response :json, content_type: /\bjson$/
  conn.use      :http_cache, store: Rails.cache, logger: Rails.logger
  conn.adapter  Faraday.default_adapter
end
