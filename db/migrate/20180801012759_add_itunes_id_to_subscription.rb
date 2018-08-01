class AddItunesIdToSubscription < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :itunes_id, :integer, index: true
  end
end
