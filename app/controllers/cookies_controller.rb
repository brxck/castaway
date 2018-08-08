class CookiesController < ApplicationController
  def create
    cookie_values = {
      podcast_id: params[:cookie][:podcast_id],
      podcast_name: params[:cookie][:podcast_name],
      art_url: params[:cookie][:art_url],
      episode_id: params[:cookie][:episode_id],
      episode_name: params[:cookie][:episode_name],
      time: params[:cookie][:time]
    }

    cookies[:last_played] = JSON.generate(cookie_values)
  end

  def destroy
    cookies.delete :last_played
  end
end
