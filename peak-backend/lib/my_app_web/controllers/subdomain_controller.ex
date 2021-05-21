defmodule MyAppWeb.SubdomainController do
  use MyAppWeb, :controller

  alias MyApp.Auth
  alias MyApp.Blog
  alias MyApp.Blog.Subdomain

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"subdomain" => subdomain}) do
    subdomains = Blog.list_subdomains()
    render(conn, "index.json", subdomains: subdomains)
  end

  def create(conn, %{"user_id" => user_id, "subdomain" => subdomain_params}) do
    new_subdomain = Map.put(subdomain_params, "user_id", user_id)
    with {:ok, %Subdomain{} = subdomain} <- Blog.create_subdomain(new_subdomain) do
      conn
      |> put_status(:created)
      |> render("show.json", subdomain: subdomain)
    end
  end

  def fetch_subdomain(conn, %{"subdomain" => subdomain}) do
    subdomain = Blog.get_subdomain!(subdomain)
    user = Auth.get_user!(subdomain.user_id)

    render(conn, "subdomain_with_author.json", %{subdomain: subdomain, user: user})
  end

  def show(conn, %{"id" => id}) do
    subdomain = Blog.get_subdomain_by_id!(id)
    render(conn, "show.json", subdomain: subdomain)
  end

  def update(conn, %{"id" => id, "subdomain" => subdomain_params}) do
    subdomain = Blog.get_subdomain_by_id!(id)

    with {:ok, %Subdomain{} = subdomain} <- Blog.update_subdomain(subdomain, subdomain_params) do
      render(conn, "show.json", subdomain: subdomain)
    end
  end

  def delete(conn, %{"id" => id}) do
    subdomain = Blog.get_subdomain_by_id!(id)

    with {:ok, %Subdomain{}} <- Blog.delete_subdomain(subdomain) do
      send_resp(conn, :no_content, "")
    end
  end
end
