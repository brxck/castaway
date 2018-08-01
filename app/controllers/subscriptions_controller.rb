class SubscriptionsController < ApplicationController
  include PodcastHelper
  include ItunesHelper

  before_action :authenticate_user!

  def index
    user_subscriptions = current_user.subscriptions
    @subscriptions = user_subscriptions.map do |subscription|
      process_podcast(Itunes.lookup(subscription.itunes_id))
    end
  end

  def create
    @subscription = current_user.subscriptions.new(itunes_id: params[:id],
                                                   name: params[:name],
                                                   feed: params[:feed])

    if @subscription.save
      render json: { status: 200 }
    else
      render json: { status: 500 }
    end
  end

  def destroy
    @subscription = current_user.subscriptions
                                .where(itunes_id: params[:itunes_id])

    if @subscription.destroy
      render json: { status: 200 }
    else
      render json: { status: 500 }
    end
  end
end
