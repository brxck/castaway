class Podcast
  attr_reader :id,
              :name,
              :author,
              :episode_count,
              :genre,
              :genres,
              :feed,
              :art100,
              :art600,
              :description,
              :episodes

  @@lookup_init = {
    "@id": "trackId",
    "@name": "collectionName",
    "@author": "artistName",
    "@episode_count": "trackCount",
    "@genre": "primaryGenreName",
    "@genres": "genres",
    "@feed": "feedUrl",
    "@art100": "artworkUrl100",
    "@art600": "artworkUrl600",
  }

  @@toplist_init = {
    "@id": "id",
    "@name": "name",
    "@author": "artistName",
    "@genres": "genres",
    "@art100": "artworkUrl100",
  }

  def initialize(data)
    init_map = data["wrapperType"] ? @@lookup_init : @@toplist_init
    init_map.each { |name, value| instance_variable_set(name, data[value]) }
    @genres = data["genres"] - ["podcasts"]
    @genre = @genres[0]["name"] if !@genre
  end

  def fetch_episodes
    res = Connect.get(@feed)
    feed = parse_feed(res.body)
    @description = feed[:description]
    @episodes = feed[:episodes]
    self
  end

  def add_history(user)
    histories =
      user.histories.where(podcast_id: @id, episode_id: @episodes.keys)
    histories.each do |history|
      @episodes[history.episode_id].listened = history.listened
      @episodes[history.episode_id].time = history.time
    end
    self
  end

  def reverse_episodes
    @episodes = @episodes.reverse_each.to_h
    self
  end

  def to_partial_path
    "podcasts/podcast"
  end

  private

  def parse_feed(xml)
    feed = Feedjira::Feed.parse_with(Feedjira::Parser::Podcast, xml)
    episodes = feed.rss.channel.items.map { |data| Episode.new(data) }
    episodes = episodes.index_by { |episode| episode.id }
    { episodes: episodes, description: sanitize(feed.description) }
  end

  def sanitize(input)
    ActionController::Base.helpers.sanitize(input)
  end
end
