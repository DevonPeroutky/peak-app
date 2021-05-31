defmodule MyAppWeb.PostController do
  use MyAppWeb, :controller

  alias MyApp.Repo
  alias MyApp.Blog
  alias MyApp.Wiki
  alias MyApp.Blog.Post

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"subdomain" => subdomain, "cursor" => cursor }) do
    %{entries: posts, metadata: cursor_metadata} = Blog.list_posts(subdomain, cursor)
    render(conn, "paginated_index.json", %{posts: posts, cursor_metadata: cursor_metadata })
  end

  def index(conn, %{"subdomain" => subdomain }) do
    %{entries: posts, metadata: cursor_metadata} = Blog.list_posts(subdomain, nil)
    render(conn, "paginated_index.json", %{posts: posts, cursor_metadata: cursor_metadata })
  end

  defp create_post_from_page(post_params) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:post, fn _repo, _changes_thus_far -> Blog.create_post(post_params) end)
    |> Ecto.Multi.run(:deleted_page, fn _repo, _changes_thus_far -> Wiki.delete_page_by_id(post_params["id"]) end)
    |> Repo.transaction
  end

  def create(conn, %{"post" => post_params, "user_id" => user_id}) do
    with {:ok, %{ post: %Post{} = post } } <- create_post_from_page(post_params) do
      conn
      |> put_status(:created)
      |> render("show.json", post: post)
    end
  end

  def show(conn, %{"id" => id}) do
    post = Blog.get_post!(id)
    render(conn, "show.json", post: post)
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    post = Blog.get_post!(id)

    with {:ok, %Post{} = post} <- Blog.update_post(post, post_params) do
      render(conn, "show.json", post: post)
    end
  end

  def delete(conn, %{"id" => id}) do
    post = Blog.get_post!(id)

    with {:ok, %Post{}} <- Blog.delete_post(post) do
      send_resp(conn, :no_content, "")
    end
  end
end
