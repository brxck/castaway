class LastPlayedController < ApplicationController
  def create
    cookie_values = {
      podcast_id: params[:cookie][:podcast_id],
      podcast_name: params[:cookie][:podcast_name],
      art_url: params[:cookie][:art_url],
      episode_id: params[:cookie][:episode_id],
      episode_title: params[:cookie][:episode_title],
      episode_url: params[:cookie][:episode_url],
      time_played: params[:cookie][:time_played]
    }
    cookies[:last_played] = JSON.generate(cookie_values)
    render json: { status: 201 }
  end

  def destroy
    cookies.delete :last_played
    render json: { status: 200 }
  end
end
