defmodule MyAppWeb.SubdomainsController do
  use MyAppWeb, :controller

  alias MyApp.Blog
  alias MyApp.Blog.Subdomains

  action_fallback MyAppWeb.FallbackController

  def index(conn, _params) do
    subdomains = Blog.list_subdomains()
    render(conn, "index.json", subdomains: subdomains)
  end

  def create(conn, %{"subdomains" => subdomains_params}) do
    with {:ok, %Subdomains{} = subdomains} <- Blog.create_subdomains(subdomains_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.subdomains_path(conn, :show, subdomains))
      |> render("show.json", subdomains: subdomains)
    end
  end

  def show(conn, %{"id" => id}) do
    subdomains = Blog.get_subdomains!(id)
    render(conn, "show.json", subdomains: subdomains)
  end

  def update(conn, %{"id" => id, "subdomains" => subdomains_params}) do
    subdomains = Blog.get_subdomains!(id)

    with {:ok, %Subdomains{} = subdomains} <- Blog.update_subdomains(subdomains, subdomains_params) do
      render(conn, "show.json", subdomains: subdomains)
    end
  end

  def delete(conn, %{"id" => id}) do
    subdomains = Blog.get_subdomains!(id)

    with {:ok, %Subdomains{}} <- Blog.delete_subdomains(subdomains) do
      send_resp(conn, :no_content, "")
    end
  end
end
