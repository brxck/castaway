class SubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def index
    user_subscriptions = current_user.subscriptions
    @subscriptions =
      user_subscriptions.map do |subscription|
        Itunes.lookup(subscription.itunes_id)
      end
  end

  def create
    @subscription = current_user.subscriptions.new(subscription_params)

    if @subscription.save
      render json: { status: 200 }
    else
      render json: { status: 400 }
    end
  end

  def destroy
    @subscription =
      current_user
        .subscriptions
        .where(itunes_id: params[:subscription][:itunes_id])
        .take

    if @subscription.destroy
      render json: { status: 200 }
    else
      render json: { status: 400 }
    end
  end

  private
    def subscription_params
      params.require(:subscription).permit(:itunes_id, :name, :feed)
    end
end
