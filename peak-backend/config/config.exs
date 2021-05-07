# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :my_app,
  ecto_repos: [MyApp.Repo],
  generators: [binary_id: true]

# Configures the endpoint
config :my_app, MyAppWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "hPJDZ6wHJCtZAVlmPaI6QqFsGf4IMSQSBayKvrK+yqMPy6RdWsW2EUiMSunUHE5j",
  render_errors: [view: MyAppWeb.ErrorView, accepts: ~w(json)],
  pubsub_server: MyApp.PubSub,
  live_view: [signing_salt: "2JPc3JXD"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Use Guardian for session-based JWT. Built using `mix guardian.gen.secret`
config :my_app, UserAuth.AuthManager.Guardian,
       issuer: "my_app",
       secret_key: "xXf0t/flhFSzr85Y0rQZcVUB+TCifBtGq4W4Ny0xrxvl/j0ajW1zweb5IGdfTj0a"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

# HTTP client
config :tesla, adapter: Tesla.Adapter.Hackney