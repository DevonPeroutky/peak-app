defmodule MyAppWeb.HealthcheckController do
  use MyAppWeb, :controller

  action_fallback MyAppWeb.FallbackController

  def index(conn, _params) do
    send_resp(conn, :ok, "OK")
  end
end