defmodule MyApp.AuthTest do
  use MyApp.DataCase

  alias MyApp.Auth

  describe "users" do
    alias MyApp.Auth.User

    @valid_attrs %{access_token: "some access_token", email: "some email", family_name: "some family_name", given_name: "some given_name", google_id: "some google_id", image_url: "some image_url"}
    @update_attrs %{access_token: "some updated access_token", email: "some updated email", family_name: "some updated family_name", given_name: "some updated given_name", google_id: "some updated google_id", image_url: "some updated image_url"}
    @invalid_attrs %{access_token: nil, email: nil, family_name: nil, given_name: nil, google_id: nil, image_url: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Auth.create_user()

      user
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Auth.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Auth.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Auth.create_user(@valid_attrs)
      assert user.access_token == "some access_token"
      assert user.email == "some email"
      assert user.family_name == "some family_name"
      assert user.given_name == "some given_name"
      assert user.google_id == "some google_id"
      assert user.image_url == "some image_url"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Auth.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = Auth.update_user(user, @update_attrs)
      assert user.access_token == "some updated access_token"
      assert user.email == "some updated email"
      assert user.family_name == "some updated family_name"
      assert user.given_name == "some updated given_name"
      assert user.google_id == "some updated google_id"
      assert user.image_url == "some updated image_url"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Auth.update_user(user, @invalid_attrs)
      assert user == Auth.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Auth.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Auth.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Auth.change_user(user)
    end
  end
end
