module LastPlayedHelper
  
  def last_podcast_path    
    return "" unless @last_played
    "/podcasts/#{@last_played['podcast_id']}"
  end

  def last_episode_path
    return "" unless @last_played
    last_podcast_path + "?episode_id=#{@last_played['episode_id']}"    
  end

  def last_art_url
    @last_played["art_url"] || ""
  end

  def last_audio_url
    @last_played["episode_url"] || ""
  end
end