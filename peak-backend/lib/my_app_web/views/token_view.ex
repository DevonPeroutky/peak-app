defmodule MyAppWeb.TokenView do
  use MyAppWeb, :view
  alias MyAppWeb.TokenView

  def render("index.json", %{tokens: tokens}) do
    %{tokens: render_many(tokens, SessionView, "token.json")}
  end

  def render("token.json", %{token: token}) do
    %{token: token.token,
      expires: token.expires,
      token_type: token.token_type
    }
  end
end
