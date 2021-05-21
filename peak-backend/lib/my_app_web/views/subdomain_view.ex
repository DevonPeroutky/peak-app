defmodule MyAppWeb.SubdomainView do
  use MyAppWeb, :view
  alias MyAppWeb.SubdomainView
  alias MyAppWeb.UserView

  def render("index.json", %{subdomains: subdomains}) do
    %{data: render_many(subdomains, SubdomainView, "subdomain.json")}
  end

  def render("show.json", %{subdomain: subdomain}) do
    render_one(subdomain, SubdomainView, "subdomain.json")
  end

  def render("subdomain.json", %{subdomain: subdomain}) do
    IO.puts "Subdomain is fine"
    %{id: subdomain.id,
      title: subdomain.title,
      description: subdomain.description,
      subdomain: subdomain.subdomain}
  end

  def render("author.json", %{user: user}) do
    IO.puts "????"
    %{id: user.id,
      email: user.email,
      image_url: user.image_url,
      peak_user_id: user.peak_user_id,
      given_name: user.given_name,
      family_name: user.family_name
    }
  end

  def render("subdomain_with_author.json", %{subdomain: subdomain, user: user}) do
    IO.puts " DOING THIS"
    IO.inspect user
    IO.inspect subdomain
    %{subdomain: render_one(subdomain, SubdomainView, "subdomain.json"),
      author: render("author.json", %{user: user})
    }
  end
end
