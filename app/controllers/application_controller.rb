class ApplicationController < ActionController::Base
  before_action :set_last_played
  before_action :robots_header
  layout :devise_layout

  private
    def set_last_played
      return unless cookies[:last_played]
      @last_played = JSON.parse(cookies[:last_played])
    end

    def robots_header
      response.set_header("X-ROBOTS-TAG", "none")
    end

    def devise_layout
      devise_controller? ? "devise" : "application"
    end
end
