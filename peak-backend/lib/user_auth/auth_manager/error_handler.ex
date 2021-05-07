## lib/auth_me/user_manager/error_handler.ex
defmodule UserAuth.AuthManager.ErrorHandler do
  import Plug.Conn

  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {type, reason}, _opts) do
    body = to_string(type)
    IO.puts "ERROR HANDLING"
    IO.puts body
    IO.inspect reason
    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(401, body)
  end
end