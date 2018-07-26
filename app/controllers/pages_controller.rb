class PagesController < ApplicationController
  def home
    
  end

  def discover
    @toplist = Gpod.toplist(5)
  end

  def search

  end
end
