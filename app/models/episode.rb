class Episode
  attr_reader :id, :title, :description, :duration, :date, :audio
  attr_accessor :time, :listened

  def initialize(data)
    # Feedjira-Podcast returns Addressable::URI if the guid is a url. We need a string.
    guid = data.guid.guid
    @id = guid.respond_to?(:path) ? guid.path : guid
    @title = sanitize(data.title)
    @description = sanitize(data.description)
    @duration = data.itunes.duration
    @date = data.pub_date
    @audio = data.enclosure.url.to_s
    @time = 0 # Will be overwritten if history exists.
  end

  def to_partial_path
    "episodes/episode"
  end

  private

  def sanitize(input)
    ActionController::Base.helpers.sanitize(input)
  end
end
