defmodule MyAppWeb.ScratchpadController do
  use MyAppWeb, :controller

  alias MyApp.Notes
  alias MyApp.Notes.Scratchpad

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"user_id" => user_id}) do
    with {:ok, %Scratchpad{} = scratchpad} <- fetch_or_create_user_scratchpad(user_id) do
      render(conn, "show.json", scratchpad: scratchpad)
    end
  end

  def create(conn, %{"scratchpad" => scratchpad_params}) do
    with {:ok, %Scratchpad{} = scratchpad} <- Notes.create_scratchpad(scratchpad_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.scratchpad_path(conn, :show, scratchpad))
      |> render("show.json", scratchpad: scratchpad)
    end
  end

  def fetch_or_create_user_scratchpad(user_id) do
    scratchpad = Notes.get_scratchpad(user_id)
    case scratchpad do
      %Scratchpad{} ->  {:ok, scratchpad}
      :nil          ->  Notes.create_scratchpad(%{ user_id: user_id })
    end
  end

  def show(conn, %{"id" => id}) do
    scratchpad = Notes.get_scratchpad!(id)
    render(conn, "show.json", scratchpad: scratchpad)
  end

  def update(conn, %{"user_id" => user_id, "id" => id, "scratchpad" => scratchpad_params}) do
    scratchpad = Notes.get_scratchpad!(user_id)

    with {:ok, %Scratchpad{} = scratchpad} <- Notes.update_scratchpad(scratchpad, scratchpad_params) do
      render(conn, "show.json", scratchpad: scratchpad)
    end
  end

  def delete(conn, %{"id" => id}) do
    scratchpad = Notes.get_scratchpad!(id)

    with {:ok, %Scratchpad{}} <- Notes.delete_scratchpad(scratchpad) do
      send_resp(conn, :no_content, "")
    end
  end
end
