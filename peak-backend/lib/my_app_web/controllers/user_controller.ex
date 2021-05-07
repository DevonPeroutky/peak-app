defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller
  alias MyApp.Crypto.JWTManager

  require Logger
  alias MyApp.Auth
  alias MyApp.Auth.User

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"email" => email}) do
    user = Auth.get_user_by_email(email)
    render(conn, "show.json", user: user)
  end

  ### Authed Routes
  def index(conn, _params) do
    users = Auth.list_users()
    render(conn, "index.json", users: users)
  end

  def show(conn, %{"id" => id}) do
    user = Auth.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Auth.get_user!(id)

    with {:ok, %User{} = user} <- Auth.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def update_hierarchy(conn, %{"user_id" => user_id, "hierarchy" => updated_hierarchy}) do
    user = Auth.get_user!(user_id)

    with {:ok, %User{} = user} <- Auth.update_user(user, %{hierarchy: updated_hierarchy}) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Auth.get_user!(id)

    with {:ok, %User{}} <- Auth.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end

  def list_all_accounts(conn, %{"peak_user_id" => peak_user_id}) do
    users = Auth.list_all_user_accounts(peak_user_id)
    render(conn, "user_accounts.json", users: users)
  end

  def get_user_by_id(id) do
    Auth.get_user(id)
  end
end
