defmodule MyAppWeb.UserControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Auth
  alias MyApp.Auth.User

  @create_attrs %{
    access_token: "some access_token",
    email: "some email",
    family_name: "some family_name",
    given_name: "some given_name",
    google_id: "some google_id",
    image_url: "some image_url"
  }
  @update_attrs %{
    access_token: "some updated access_token",
    email: "some updated email",
    family_name: "some updated family_name",
    given_name: "some updated given_name",
    google_id: "some updated google_id",
    image_url: "some updated image_url"
  }
  @invalid_attrs %{access_token: nil, email: nil, family_name: nil, given_name: nil, google_id: nil, image_url: nil}

  def fixture(:user) do
    {:ok, user} = Auth.create_user(@create_attrs)
    user
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all users", %{conn: conn} do
      conn = get(conn, Routes.user_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create user" do
    test "renders user when data is valid", %{conn: conn} do
      conn = post(conn, Routes.user_path(conn, :create), user: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.user_path(conn, :show, id))

      assert %{
               "id" => id,
               "access_token" => "some access_token",
               "email" => "some email",
               "family_name" => "some family_name",
               "given_name" => "some given_name",
               "google_id" => "some google_id",
               "image_url" => "some image_url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.user_path(conn, :create), user: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update user" do
    setup [:create_user]

    test "renders user when data is valid", %{conn: conn, user: %User{id: id} = user} do
      conn = put(conn, Routes.user_path(conn, :update, user), user: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.user_path(conn, :show, id))

      assert %{
               "id" => id,
               "access_token" => "some updated access_token",
               "email" => "some updated email",
               "family_name" => "some updated family_name",
               "given_name" => "some updated given_name",
               "google_id" => "some updated google_id",
               "image_url" => "some updated image_url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, user: user} do
      conn = put(conn, Routes.user_path(conn, :update, user), user: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete user" do
    setup [:create_user]

    test "deletes chosen user", %{conn: conn, user: user} do
      conn = delete(conn, Routes.user_path(conn, :delete, user))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.user_path(conn, :show, user))
      end
    end
  end

  defp create_user(_) do
    user = fixture(:user)
    {:ok, user: user}
  end
end
