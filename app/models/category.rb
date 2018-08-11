class Category < ApplicationRecord
  belongs_to :category, foreign_key: "parent_id", optional: true
  has_many :subcategories, class_name: "Category", foreign_key: "parent_id"

  def podcasts
    Itunes.genre(id)
  end
end
