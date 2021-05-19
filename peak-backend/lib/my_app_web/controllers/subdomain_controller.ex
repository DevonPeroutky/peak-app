defmodule MyAppWeb.SubdomainController do
  use MyAppWeb, :controller

  alias MyApp.Blog
  alias MyApp.Blog.Subdomain

  action_fallback MyAppWeb.FallbackController

  def index(conn, _params) do
    subdomains = Blog.list_subdomains()
    render(conn, "index.json", subdomains: subdomains)
  end

  def create(conn, %{"subdomain" => subdomain_params}) do
    with {:ok, %Subdomain{} = subdomain} <- Blog.create_subdomain(subdomain_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.subdomain_path(conn, :show, subdomain))
      |> render("show.json", subdomain: subdomain)
    end
  end

  def show(conn, %{"id" => id}) do
    subdomain = Blog.get_subdomain!(id)
    render(conn, "show.json", subdomain: subdomain)
  end

  def update(conn, %{"id" => id, "subdomain" => subdomain_params}) do
    subdomain = Blog.get_subdomain!(id)

    with {:ok, %Subdomain{} = subdomain} <- Blog.update_subdomain(subdomain, subdomain_params) do
      render(conn, "show.json", subdomain: subdomain)
    end
  end

  def delete(conn, %{"id" => id}) do
    subdomain = Blog.get_subdomain!(id)

    with {:ok, %Subdomain{}} <- Blog.delete_subdomain(subdomain) do
      send_resp(conn, :no_content, "")
    end
  end
end
