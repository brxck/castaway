class Subscription < ApplicationRecord
  validates :name, presence: true
  validates :feed, presence: true

  belongs_to :user
end
