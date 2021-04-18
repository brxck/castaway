class ApiResponse < ApplicationRecord
  validates :url, presence: true, uniqueness: true
  validates :payload, presence: true

  # Accepts URL, a cache policy, and a block to parse response to a GET.
  def self.cache(url, cache_policy)
    record = find_by(url: url)
    if !record
      logger.debug "ApiResponse: Miss #{url}"
      response = Connect.get(url)
      raise "Request failed" if !response.success?
      result = block_given? ? yield(response) : JSON.parse(response.body)
      create(url: url, payload: result).payload
    elsif record.updated_at < cache_policy.call
      logger.debug "ApiResponse: Expired #{url}"
      response = Connect.get(url)
      raise "Request failed" if !response.success?
      result = block_given? ? yield(response) : JSON.parse(response.body)
      record.update(payload: result, updated_at: Time.zone.now)
      record.payload
    else
      logger.debug "ApiResponse: Found #{url}"
      record.payload
    end
  end
end
