module PodcastHelper
  def format_seconds(seconds)
    return "----" if seconds.nil?
    Time.at(seconds).utc.strftime("%H:%M:%S").gsub(/^(0+:*)+/, "")
  end
end
