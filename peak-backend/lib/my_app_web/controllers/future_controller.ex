defmodule MyAppWeb.FutureController do
  use MyAppWeb, :controller

  alias MyApp.Reading
  alias MyApp.Reading.Future

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"user_id" => user_id}) do
    future_reads = Reading.list_future_reads_of_user(user_id)
    render(conn, "index.json", future_reads: future_reads)
  end

  def create(conn, %{"future" => future_params, "user_id" => user_id}) do
    new_reading_list_item = Map.put(future_params, "user_id", user_id)
    with {:ok, %Future{} = future} <- Reading.create_future(new_reading_list_item) do
      conn
      |> put_status(:created)
#      |> put_resp_header("location", Routes.future_path(conn, :show, future))
      |> render("show.json", future: future)
    end
  end

  def show(conn, %{"id" => id}) do
    future = Reading.get_future!(id)
    render(conn, "show.json", future: future)
  end

  def update(conn, %{"id" => id, "future" => future_params}) do
    future = Reading.get_future!(id)
    new_future_params = Map.new(future_params, fn {k, v} -> { String.to_atom(k), v } end)
    new_future = Map.merge(future, new_future_params)

    with {:ok, %Future{} = future} <- Reading.update_future(future, Map.from_struct(new_future)) do
      render(conn, "show.json", future: future)
    end
  end

  def update_date_read(conn, %{"user_id" => _user_id, "future_id" => future_id}) do
    future = Reading.get_future!(future_id)
    new_future = Map.from_struct(%{future | date_read: DateTime.utc_now()})
    with {:ok, %Future{} = future} <- Reading.update_future(future, new_future) do
      render(conn, "show.json", future: future)
    end
  end

  def delete(conn, %{"id" => id}) do
    future = Reading.get_future!(id)

    with {:ok, %Future{}} <- Reading.delete_future(future) do
      send_resp(conn, :no_content, "")
    end
  end
end
