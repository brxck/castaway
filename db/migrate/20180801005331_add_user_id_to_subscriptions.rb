class AddUserIdToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_reference :subscriptions, :user
  end
end
