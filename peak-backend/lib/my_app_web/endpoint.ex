defmodule MyApp.CORS do
  use Corsica.Router,
      origins: [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://localhost:5000",
#        "https://peak-webapp.onrender.com",
        "https://peak-app-server.onrender.com",
        "file://peak-electron-app",
        "chrome-extension://jdenmafkllgoggagbbbcahkdjhdednpf",
        "https://cur8.dev",
        "https://*.cur8.dev",
      ],
      allow_credentials: true,
      ## TODO REmove: x-requested-with
      allow_headers: ["accept", "content-type", "x-requested-with"],
      allow_methods: :all,
      log: [rejected: :warn, invalid: :warn, accepted: :info]

  resource "/*"
end

defmodule MyAppWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :my_app

  # Attempt #3123469 at trying to specify the "access-control-allow-origin" header in the preflight CORS response
  #  plug Corsica, origins: "http://localhost:3001", allow_headers: ["accept", "content-type"]
  plug MyApp.CORS

  env = System.get_env("MIX_ENV") || "dev"
  secure_value = if(env == "prod", do: true, else: false)
  extra_value = if(env == "prod", do: "SameSite=None", else: "")

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    secure: secure_value,
    extra: extra_value,
    key: "_my_app_key",
    signing_salt: "7LQYTCzs"
  ]

  socket "/socket", MyAppWeb.UserSocket,
    websocket: [check_origin: false], # TODO: Need to figure out a way for Electron/Chrome extension to be able to configure their origin. Or setup a proxy
    longpoll: false

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :my_app,
    gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug MyAppWeb.Router
end
