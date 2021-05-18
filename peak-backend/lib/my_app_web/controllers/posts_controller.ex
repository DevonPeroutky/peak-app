defmodule MyAppWeb.PostsController do
  use MyAppWeb, :controller

  alias MyApp.Blog
  alias MyApp.Blog.Posts

  action_fallback MyAppWeb.FallbackController

  def index(conn, _params) do
    blog_posts = Blog.list_blog_posts()
    render(conn, "index.json", blog_posts: blog_posts)
  end

  def create(conn, %{"posts" => posts_params}) do
    with {:ok, %Posts{} = posts} <- Blog.create_posts(posts_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.posts_path(conn, :show, posts))
      |> render("show.json", posts: posts)
    end
  end

  def show(conn, %{"id" => id}) do
    posts = Blog.get_posts!(id)
    render(conn, "show.json", posts: posts)
  end

  def update(conn, %{"id" => id, "posts" => posts_params}) do
    posts = Blog.get_posts!(id)

    with {:ok, %Posts{} = posts} <- Blog.update_posts(posts, posts_params) do
      render(conn, "show.json", posts: posts)
    end
  end

  def delete(conn, %{"id" => id}) do
    posts = Blog.get_posts!(id)

    with {:ok, %Posts{}} <- Blog.delete_posts(posts) do
      send_resp(conn, :no_content, "")
    end
  end
end
