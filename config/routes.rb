Rails.application.routes.draw do
  root "pages#discover"

  devise_for :users

  get 'podcast/:id', to: "podcast#show", as: "podcast"
end
