defmodule MyAppWeb.SessionView do
  use MyAppWeb, :view
  alias MyAppWeb.SessionView

  def render("show.json", %{user: user}) do
    %{data: render_one(user, SessionView, "user.json")}
  end

  def render("user_with_socket_token.json", %{user: user}) do
    %{id: user.id,
      socket_access_token: user.socket_access_token}
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

  def render("index.json", %{tokens: tokens}) do
    %{tokens: render_many(tokens, SessionView, "token.json")}
  end

  def render("token.json", %{token: token}) do
    %{upload_token: token.token,
      expires: token.expires,
      token_type: token.token_type
    }
  end
end
