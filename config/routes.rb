Rails.application.routes.draw do
  root "pages#discover"

  devise_for :users

  resource :subscriptions, only: %i[create destroy]
  get "subscriptions", to: "subscriptions#index"

  get "discover", to: "pages#discover", as: "discover"
  get "search", to: "pages#search", as: "search"
  get "podcast/:id", to: "podcast#show", as: "podcast"
end
