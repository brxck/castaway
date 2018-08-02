class HistoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_history, only: %i[update destroy]

  def create
    @history = current_user.histories.new(history_params)

    if @history.save
      render json: { status: 200 }
    else
      render json: { status: 500 }
    end
  end

  def update
    if @history.update(listened: params[:history][:listened],
                       time: params[:history][:time])
      render json: { status: 200 }
    else
      render json: { status: 500 }
    end
  end

  def destroy
    if @history.destroy
      render json: { status: 200 }
    else
      render json: { status: 500 }
    end
  end

  private

  def history_params
    params.require(:history).permit(:episode_id, :listened, :time, :podcast_id)
  end

  def set_history
    @history = current_user.histories
                           .where(episode_id: params[:history][:episode_id],
                                  podcast_id: params[:history][:podcast_id])
                           .first
  end
end
