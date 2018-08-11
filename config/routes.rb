Rails.application.routes.draw do
  get 'history/create'
  get 'history/destroy'
  root "pages#discover"

  devise_for :users

  resource :subscriptions, only: %i[create destroy]
  get "subscriptions", to: "subscriptions#index"

  resource :histories, only: %i[create destroy update]
  resource :cookies, only: %i[create destroy]

  get "about", to: "pages#about", as: "about"
  get "discover", to: "pages#discover", as: "discover"
  get "search", to: "pages#search", as: "search"
  get "podcasts/:id", to: "podcasts#show", as: "podcast"
  get "categories", to: "categories#index", as: "categories"
  get "categories/:id", to: "categories#show", as: "category"
end
