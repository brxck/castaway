class CreateCuratedPodcasts < ActiveRecord::Migration[5.2]
  def change
    create_table :curated_podcasts do |t|
      t.timestamps
    end
  end
end
