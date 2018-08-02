Rails.application.routes.draw do
  get 'history/create'
  get 'history/destroy'
  root "pages#discover"

  devise_for :users

  resource :subscriptions, only: %i[create destroy]
  get "subscriptions", to: "subscriptions#index"

  resource :histories, only: %i[create destroy update]

  get "discover", to: "pages#discover", as: "discover"
  get "search", to: "pages#search", as: "search"
  get "podcast/:id", to: "podcast#show", as: "podcast"
end
