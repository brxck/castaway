class Episode < ApplicationRecord
  def self.from_feed(feed)
    feed["episodes"].map { |episode| [episode["id"], episode] }.to_h
  end

  def self.with_histories(feed)
    episodes = feed[:episodes].map { |episode| [episode.id, episode] }.to_h
    episode_ids = episodes.each_with_object([]) do |(_, episode), ids|
      ids << episode.id
    end

    current_user.histories.where(podcast_id: params[:id],
                                 episode_id: episode_ids)

    histories.each_with_object(episodes) do |history, episodes|
      episodes[history.episode_id].listened = history.listened
      episodes[history.episode_id].time = history.time
    end
    episodes
  end
end
