module PodcastHelper
  def format_seconds(seconds)
    Time.at(seconds).utc.strftime("%H:%M:%S").gsub(/^(0*:)+/, "")
  end
end
