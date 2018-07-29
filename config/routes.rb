Rails.application.routes.draw do
  root "pages#discover"

  devise_for :users

  get "discover", to: "pages#discover", as: "discover"
  get "search", to: "pages#search", as: "search"
  get "podcast/:id", to: "podcast#show", as: "podcast"
end
