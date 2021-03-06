Rails
  .application
  .routes
  .draw do
    root "pages#discover"

    devise_for :users

    resources :subscriptions, only: %i[create destroy index]
    resources :histories, only: %i[create destroy update]
    resources :last_played, only: %i[create destroy]
    resources :categories, only: %i[index show]

    resources :podcasts, only: %i[show] do
      get "new_episodes", on: :member
    end

    get "about", to: "pages#about", as: "about"
    get "discover", to: "pages#discover", as: "discover"
    get "popular", to: "pages#popular", as: "popular"
    get "search", to: "pages#search", as: "search"
  end
