class ApiResponse < ApplicationRecord
  validates :url, presence: true, uniqueness: true
  validates :json, presence: true

  def self.cache(url, cache_policy)
    record = find_by(url: url)

    if !record
      logger.info "ApiResponse: Miss"
      return create(url: url, json: yield).json
    elsif record.updated_at < cache_policy.call
      logger.info "ApiResponse: Expired"
      record.update(json: yield, updated_at: Time.zone.now)
      return record.json
    else
      logger.info "ApiResponse: Found"
      return record.json
    end
  end
end
