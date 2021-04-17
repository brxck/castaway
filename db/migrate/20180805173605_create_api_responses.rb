class CreateApiResponses < ActiveRecord::Migration[5.2]
  def change
    create_table :api_responses do |t|
      t.timestamps null: false
      t.text :url, null: false, index: true
      t.json :payload, null: false
    end
  end
end
