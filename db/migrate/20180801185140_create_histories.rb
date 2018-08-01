class CreateHistories < ActiveRecord::Migration[5.2]
  def change
    create_table :histories do |t|
      t.string :episode_id
      t.boolean :listened
      t.float :time
      t.integer :podcast_id
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :histories, :episode_id
    add_index :histories, :podcast_id
  end
end
