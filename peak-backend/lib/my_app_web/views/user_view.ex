defmodule MyAppWeb.UserView do
  use MyAppWeb, :view
  alias MyAppWeb.UserView

  def render("index.json", %{users: users}) do
    %{users: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      email: user.email,
      image_url: user.image_url,
      peak_user_id: user.peak_user_id,
      given_name: user.given_name,
      hierarchy: user.hierarchy,
      family_name: user.family_name,
      access_token: user.access_token}
  end

  def render("user_accounts.json", %{users: users}) do
    %{users: render_many(users, UserView, "user_account.json")}
  end

  def render("user_account.json", %{user: user}) do
    %{id: user.id,
      email: user.email,
      image_url: user.image_url,
      peak_user_id: user.peak_user_id,
      given_name: user.given_name,
      access_token: user.access_token}
  end
end
