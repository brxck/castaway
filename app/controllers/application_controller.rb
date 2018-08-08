class ApplicationController < ActionController::Base
  before_action :set_last_played

  private

  def set_last_played
    if user_signed_in?
      # Pull last played from database
    elsif cookies[:last_played]
      @last_played = JSON.parse(cookies[:last_played])
    end
  end
end
