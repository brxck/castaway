class ApplicationController < ActionController::Base
  before_action :set_last_played

  private

  def set_last_played
    return unless cookies[:last_played]
    @last_played = JSON.parse(cookies[:last_played])
  end
end
