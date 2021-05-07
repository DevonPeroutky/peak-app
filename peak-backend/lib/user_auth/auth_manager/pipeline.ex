defmodule UserAuth.AuthManager.Pipeline do
  use Guardian.Plug.Pipeline,
      otp_app: :my_app,
      error_handler: UserAuth.AuthManager.ErrorHandler,
      module: UserAuth.AuthManager.Guardian

  def introspect(conn, _opts) do
    IO.puts "INTROSPECTING"
    IO.inspect conn
    conn
  end

#  plug :introspect

  # If there is a session token, restrict it to an access token and validate it
  plug Guardian.Plug.VerifySession

  plug Guardian.Plug.VerifyCookie

  # If there is an authorization header, restrict it to an access token and validate it
#  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}

  # Load the user if either of the verifications worked
  plug Guardian.Plug.LoadResource, allow_blank: true
end
