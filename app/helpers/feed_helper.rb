module FeedHelper
  class Feed
    def self.parse(xml)
      Feedjira::Feed.parse_with(Feedjira::Parser::Podcast, xml)
    end
  end
end
