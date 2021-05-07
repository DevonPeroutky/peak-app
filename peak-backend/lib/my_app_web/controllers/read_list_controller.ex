defmodule MyAppWeb.ReadingListController do
  use MyAppWeb, :controller

  alias MyApp.Reading

  action_fallback MyAppWeb.FallbackController
  plug :put_view, MyAppWeb.FutureView

  def index(conn, params) do
    future = Reading.fetch_next_read_for_user(params)
    render(conn, "show.json", future: future)
  end
end