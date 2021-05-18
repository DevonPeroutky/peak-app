defmodule MyAppWeb.SubdomainsView do
  use MyAppWeb, :view
  alias MyAppWeb.SubdomainsView

  def render("index.json", %{subdomains: subdomains}) do
    %{data: render_many(subdomains, SubdomainsView, "subdomains.json")}
  end

  def render("show.json", %{subdomains: subdomains}) do
    %{data: render_one(subdomains, SubdomainsView, "subdomains.json")}
  end

  def render("subdomains.json", %{subdomains: subdomains}) do
    %{id: subdomains.id,
      title: subdomains.title,
      subdomain: subdomains.subdomain}
  end
end
