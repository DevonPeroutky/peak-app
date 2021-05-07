defmodule MyApp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application
  alias GoogleCerts.CertificateCache

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      MyApp.Repo,
      # Start the endpoint when the application starts
      MyAppWeb.Endpoint,
      # Starts a worker by calling: MyApp.Worker.start_link(arg)
      # {MyApp.Worker, arg},

      # This to for caching the Google OAuth Public Keys: https://hexdocs.pm/google_certs/readme.html#how-to-use-with-the-joken-library
      CertificateCache,

      # After upgrade to Phoenix 1.5.7, I was told to do this
      {Phoenix.PubSub, [name: MyApp.PubSub, adapter: Phoenix.PubSub.PG2]},

      MyAppWeb.JournalPresence
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MyApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    MyAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
