defmodule MyAppWeb.SubdomainView do
  use MyAppWeb, :view
  alias MyAppWeb.SubdomainView

  def render("index.json", %{subdomains: subdomains}) do
    %{data: render_many(subdomains, SubdomainView, "subdomain.json")}
  end

  def render("show.json", %{subdomain: subdomain}) do
    %{data: render_one(subdomain, SubdomainView, "subdomain.json")}
  end

  def render("subdomain.json", %{subdomain: subdomain}) do
    %{id: subdomain.id,
      title: subdomain.title,
      subdomain: subdomain.subdomain}
  end
end
