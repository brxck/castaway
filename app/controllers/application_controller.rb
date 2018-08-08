class ApplicationController < ActionController::Base
  before_action :set_last_played
  layout :devise_layout

  private

  def set_last_played
    return unless cookies[:last_played]
    @last_played = JSON.parse(cookies[:last_played])
  end

  def devise_layout
    if devise_controller?
      "devise"
    else
      "application"
    end
  end
end
