defmodule MyAppWeb.SessionController do
  use MyAppWeb, :controller

  alias MyApp.Auth
  alias MyApp.Auth.User
  alias MyApp.Crypto.JWTManager
  alias UserAuth.AuthManager.Guardian

  defp merge_user_object(decoded_user, custom_peak_params, access_token) do
    one_time_code = if Map.has_key?(custom_peak_params, "one_time_code"), do: custom_peak_params["one_time_code"], else: "on_time_code_not_passed"
    peak_user_id = if Map.has_key?(custom_peak_params, "existing_peak_user_id"), do: custom_peak_params["existing_peak_user_id"], else: Ecto.UUID.generate()
    decoded_user
    |> Map.put("id", decoded_user["sub"])
    |> Map.put("image_url", decoded_user["picture"])
    |> Map.put("access_token", access_token)
    |> Map.put("peak_user_id", peak_user_id)
    |> Map.put("one_time_code", one_time_code)
  end

  def login_user(conn, %{"user" => custom_peak_params, "id_token" => id_token, "access_token" => access_token}) do

    # TODO: Verify the accessToken lines up with the UserId
    case JWTManager.verify_and_validate(id_token) do
      {:ok, user_obj} ->
        user_to_insert = merge_user_object(user_obj, custom_peak_params, access_token)

        with {:ok, %User{} = user} <- Auth.upsert_user(user_to_insert) do
          conn
          |> Guardian.Plug.sign_in(user_to_insert)
          |> Guardian.Plug.remember_me(user_to_insert)
          |> put_status(:created)
          |> render("user.json", user: user)
        end
      {:error, err} ->
        IO.puts "Error verifying the JWT from Google (allegedly)"
        IO.inspect err
        {:error, :unauthorized}
    end
  end

  def load_user_for_chrome_extension(conn, %{"user_id" => user_id}) do
#    case UserController.get_user_by_access_token() do
#      {:ok, } ->
#        IO.puts "Error verifying the JWT from Google (allegedly)"
#        IO.inspect err
#        {:error, :unauthorized}
#        with {:ok, %User{} = user} <- Auth.upsert_user(user_to_insert) do
#          conn
#          |> Guardian.Plug.sign_in(user_to_insert)
#          |> Guardian.Plug.remember_me(user_to_insert)
#          |> put_status(:created)
#          |> render("user.json", user: user)
#        end
#      {:error, err} ->
#        IO.puts "Could not find user + access_token combo"
#        IO.inspect err
#        {:error, :unauthorized}
#    end

    user = Auth.get_user!(user_id)
    render(conn, "user.json", user: user)
  end

  def load_user_with_one_time_code(conn, %{"one-time-code" => one_time_code}) do
    with {:ok, user } <- Auth.get_user_by_one_time_code(one_time_code) do
      conn
      |> Guardian.Plug.sign_in(Map.from_struct(user))
      |> Guardian.Plug.remember_me(Map.from_struct(user))
      |> put_status(:created)
      |> render("user.json", user: user)
    else
      {:error, _} ->
        conn
        |> put_status(:unauthorized)
        |> put_view(MyAppWeb.ErrorView)
        |> render(:"401")
    end
  end

  def generate_auth_token(conn, %{"user_id" => userId}) do
    user = Auth.get_user!(userId)
    token = user
            |> Map.from_struct
            |> Guardian.generate_socket_access_token
    with {:ok, token, claims} <- token do
      conn
      |> render( "user_with_socket_token.json", user: Map.put(user, :socket_access_token, token))
    end
  end

  def fetch_object_upload_token(conn, %{"user_id" => userId}) do
    with {:ok, token} <- Goth.fetch(MyApp.Goth) do
      render(conn, MyAppWeb.TokenView, "token.json", token: Map.put(token, :token_type, "file_upload"))
    end
  end

  def logout(conn, params) do
    IO.puts "Logging you out"
    conn
    |> Guardian.Plug.sign_out(clear_remember_me: true)
    |> send_resp(204, "")
  end

  def test_login_user(conn, _params) do
      user_id = "108703174669232421421"
      user = {:ok, Map.from_struct(Auth.get_user!("108703174669232421421"))}
      user_struct = Auth.get_user!("108703174669232421421")
      with {:ok, user} <- user do
        conn
        |> Guardian.Plug.sign_in(user)
        |> Guardian.Plug.remember_me(user)
        |> put_status(:created)
        |> render("user.json", user: user_struct)
      end
  end

  def test_api_use(conn, _params) do
    bro = Guardian.Plug.current_resource(conn)
    user = Auth.get_user("108703174669232421421")

    MyAppWeb.Endpoint.broadcast("journal:" <> user.id, "test", %{message: "hey"})
    with {:ok, %User{} = user} <- user do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("user.json", user: user)
    end
  end

  def test(conn, _params) do
    user = Auth.get_user("108703174669232421421")
    MyAppWeb.Endpoint.broadcast("journal:" <> user.id, "test", %{message: "hey"})

    with {:ok, %User{} = user} <- user do
      conn
      |> send_resp(204, "")
    end
  end
end