defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  # Our pipeline implements "maybe" authenticated. We'll use the `:ensure_auth` below for when we need to make sure someone is logged in.
  pipeline :auth do
    plug UserAuth.AuthManager.Pipeline
  end

  # We use ensure_auth to fail if there is no one logged in
  pipeline :ensure_auth do
    plug Guardian.Plug.EnsureAuthenticated
  end

  pipeline :admin do
    plug :fetch_session
    plug :accepts, ["json"]
    plug ProperCase.Plug.SnakeCaseParams
  end

  pipeline :public do
    plug :fetch_session
    plug :accepts, ["json"]
    plug ProperCase.Plug.SnakeCaseParams
  end

  scope "/healthcheck", MyAppWeb do
    pipe_through :public
    get "/", HealthcheckController, :index
  end

  scope "/admin/v1", MyAppWeb do
    pipe_through :admin
    resources "/users", UserController, only: [:index]
  end

  scope "/blog/v1", MyAppWeb do
    pipe_through [:public]
    get "/", SubdomainController, :fetch_subdomain
    resources "/posts", PostController, only: [:index, :show]
  end

  scope "/api/v1", MyAppWeb do
    pipe_through [:public, :auth]
    get "/subdomains", SubdomainController, :fetch_subdomain
    resources "/users", UserController, only: [:update, :show] do
      get "/fetch-image-upload-access-token", SessionController, :fetch_object_upload_token
      get "/fetch-socket-access-token", SessionController, :generate_auth_token
      get "/list-all-accounts", UserController, :list_all_accounts
      get "/load-entire-state", FatUserController, :load_entire_state
      put "/update-hierarchy", UserController, :update_hierarchy
      get "/fetch-latest-note", BookController, :fetch_latest_webnote
      post "/fetch-link-metadata", LinkMetadataController, :fetch_link_metadata
      post "/bulk-update-journal", JournalEntryController, :bulk_update_journal
      resources "/blog", SubdomainController, only: [:update, :show, :index, :create, :delete] do
        resources "/post", PostController, only: [:update, :show, :create, :delete]
      end
      resources "/topics", TopicController, only: [:update, :show, :index, :create, :delete]
      resources "/tags", TagController, only: [:new, :index, :edit, :delete, :create]
      resources "/books", BookController, only: [:index, :delete, :create, :update]
      resources "/journal-entries", JournalEntryController, only: [:show, :index]
      resources "/pages", PageController, only: [:update, :show, :index, :create, :delete]
      resources "/future-reads", FutureController, only: [:show, :index, :create, :delete, :update] do
        put "/update-date-read", FutureController, :update_date_read
      end
      resources "/scratchpad", ScratchpadController, only: [:index, :update]
      resources "/next-reading-list-item", ReadingListController, only: [:index]
      get "/load-user-for-extension", SessionController, :load_user_for_chrome_extension
    end
  end

  ## UnAuthed Endpoints for Logging/Linking Users
  scope "/api/v1/session", MyAppWeb do
    pipe_through [:public, :auth]
    post "/login", SessionController, :login_user
    post "/logout", SessionController, :logout
    get "/load-user-with-oneTimeCode", SessionController, :load_user_with_one_time_code
  end

  ## TEST ENDPOINTs
  scope "/api/v1", MyAppWeb do
    pipe_through [:public, :auth]
    post "/test-login", SessionController, :test_login_user
    post "/test", SessionController, :test
    post "/test-logout", SessionController, :logout
  end
  scope "/api/v1", MyAppWeb do
    pipe_through [:public, :auth, :ensure_auth]
    post "/test-api", SessionController, :test_api_use
  end
end