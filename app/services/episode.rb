class Episode
  def self.from_feed(feed)
    feed[:episodes].index_by { |episode| episode[:id] }
  end

  def self.with_histories(feed)
    episodes = feed[:episodes].index_by { |episode| episode.id }
    episode_ids =
      episodes.each_with_object([]) { |(_, episode), ids| ids << episode.id }

    current_user.histories.where(
      podcast_id: params[:id],
      episode_id: episode_ids,
    )

    histories.each_with_object(episodes) do |history, episodes|
      episodes[history.episode_id].listened = history.listened
      episodes[history.episode_id].time = history.time
    end
    episodes
  end
end
