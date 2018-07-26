class PodcastController < ApplicationController
  include ItunesHelper
  
  def show
    @podcast = Itunes.lookup(params[:id])
  end

  def listen
  end

  def subscribe
  end
end
