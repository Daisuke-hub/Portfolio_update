class ChangeColumnToMessage < ActiveRecord::Migration[5.2]
  def change
    change_column_null :messages, :user_id, false
    change_column_null :messages, :room_id, false
    change_column_null :messages, :receiver_id, false
  end
end
