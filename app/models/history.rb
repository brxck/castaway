class History < ApplicationRecord
  belongs_to :user
  validates :episode_id, uniqueness: { scope: :podcast_id }
end
