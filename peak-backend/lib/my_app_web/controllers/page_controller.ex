defmodule MyAppWeb.PageController do
  use MyAppWeb, :controller

  alias MyApp.Wiki
  alias MyApp.Wiki.Page
  alias MyAppWeb.Utils.Hierarchy
  alias MyApp.Repo
  alias MyApp.Auth

  action_fallback MyAppWeb.FallbackController

  defp delete_page_and_remove_from_hierarchy(user_id, topic_id, page_id) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:page, fn _repo, _changes_thus_far -> Wiki.get_page(page_id)  end)
    |> Ecto.Multi.run(:delete_result, fn _repo, %{page: page} -> Wiki.delete_page(page) end)
    |> Ecto.Multi.run(:user, fn _repo, _changes_thus_far -> Auth.get_user(user_id)  end)
    |> Ecto.Multi.run(:hierarchy, fn _repo, %{user: user} ->
      new_hierarchy = Hierarchy.remove_page_from_hierarchy(topic_id, page_id, user.hierarchy)
      case Auth.update_user(user, %{"hierarchy" => new_hierarchy}) do
        {:ok, updated_user} -> {:ok, updated_user.hierarchy}
        {:error, anything} -> {:error, anything}
      end
    end)
    |> Repo.transaction
  end

  defp update_page_and_hierarchy(user_id, page_id, page_params, hierarchy) do
    IO.puts("User Id: #{user_id}")
    IO.puts("Page Id #{page_id}")
    IO.inspect page_params
    IO.inspect hierarchy

    Ecto.Multi.new()
    |> Ecto.Multi.run(:user, fn _repo, _changes_thus_far -> Auth.get_user(user_id) end)
    |> Ecto.Multi.run(:page, fn _repo, _changes_thus_far -> Wiki.get_page(page_id) end)
    |> Ecto.Multi.run(:updated_page, fn _repo, %{page: page} ->
      new_page_params = Map.new(page_params, fn {k, v} -> { String.to_atom(k), v } end)
      new_page = Map.merge(page, new_page_params)
      Wiki.update_page(page, Map.from_struct(new_page))
    end)
    |> Ecto.Multi.run(:hierarchy, fn _repo, %{user: user} ->
      case Auth.update_user(user, %{"hierarchy" => hierarchy}) do
        {:ok, updated_user} -> {:ok, updated_user.hierarchy}
        {:error, anything} -> {:error, anything}
      end
    end)
    |> Repo.transaction
  end

  def index(conn, %{"user_id" => user_id}) do
    pages = Wiki.list_pages(user_id)
    render(conn, "index.json", pages: pages)
  end

  def create(conn, %{"page" => page_params, "user_id" => user_id}) do
    new_page = page_params
    |> Map.put("user_id", user_id)

    with {:ok, %Page{} = page} <- Wiki.create_page(new_page) do
      conn
      |> put_status(:created)
#      |> put_resp_header("location", Routes.page_path(conn, :show, page))
      |> render("show.json", page: page)
    end
  end

  def show(conn, %{"id" => id}) do
    page = Wiki.get_page!(id)
    render(conn, "show.json", page: page)
  end

  def update(conn, %{"user_id" => user_id, "id" => id, "page" => page_params, "hierarchy" => hierarchy}) do
    with {:ok, %{hierarchy: hierarchy, updated_page: page}} <- update_page_and_hierarchy(user_id, id, page_params, hierarchy) do
      render(conn, "page_with_hierarchy.json", %{page: page, hierarchy: hierarchy})
    end
  end

  def update_topic_id(conn, %{"user_id" => user_id, "id" => id, "page" => page_params, "hierarchy" => hierarchy}) do
    with {:ok, %{hierarchy: hierarchy, updated_page: page}} <- update_page_and_hierarchy(user_id, id, page_params, hierarchy) do
      render(conn, "page_with_hierarchy.json", %{page: page, hierarchy: hierarchy})
    end
  end

  def delete(conn, %{"user_id" => user_id, "topic_id" => topic_id, "id" => id}) do
    with {:ok, %{hierarchy: hierarchy}} <- delete_page_and_remove_from_hierarchy(user_id, topic_id, id) do
      render(conn, "hierarchy_only.json", %{hierarchy: hierarchy})
    end
  end

  ## -----------
  ## Deprecated
  ## -----------
  @deprecated "Not longer need to do this, since no longer embedded notes/books in editors"
  defp get_book_notes_from_page(page_body) do
    IO.puts "Getting the page notes"
    page_body["children"]
    |> Enum.filter(fn  n -> n["type"] == "peak_book_note" || n["type"] == "peak_web_note" end)
  end
end
