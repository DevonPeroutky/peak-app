defmodule MyApp.BlogTest do
  use MyApp.DataCase

  alias MyApp.Blog

  describe "subdomains" do
    alias MyApp.Blog.Subdomain

    @valid_attrs %{subdomain: "some subdomain", title: "some title"}
    @update_attrs %{subdomain: "some updated subdomain", title: "some updated title"}
    @invalid_attrs %{subdomain: nil, title: nil}

    def subdomain_fixture(attrs \\ %{}) do
      {:ok, subdomain} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_subdomain()

      subdomain
    end

    test "list_subdomains/0 returns all subdomains" do
      subdomain = subdomain_fixture()
      assert Blog.list_subdomains() == [subdomain]
    end

    test "get_subdomain!/1 returns the subdomain with given id" do
      subdomain = subdomain_fixture()
      assert Blog.get_subdomain!(subdomain.id) == subdomain
    end

    test "create_subdomain/1 with valid data creates a subdomain" do
      assert {:ok, %Subdomain{} = subdomain} = Blog.create_subdomain(@valid_attrs)
      assert subdomain.subdomain == "some subdomain"
      assert subdomain.title == "some title"
    end

    test "create_subdomain/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_subdomain(@invalid_attrs)
    end

    test "update_subdomain/2 with valid data updates the subdomain" do
      subdomain = subdomain_fixture()
      assert {:ok, %Subdomain{} = subdomain} = Blog.update_subdomain(subdomain, @update_attrs)
      assert subdomain.subdomain == "some updated subdomain"
      assert subdomain.title == "some updated title"
    end

    test "update_subdomain/2 with invalid data returns error changeset" do
      subdomain = subdomain_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_subdomain(subdomain, @invalid_attrs)
      assert subdomain == Blog.get_subdomain!(subdomain.id)
    end

    test "delete_subdomain/1 deletes the subdomain" do
      subdomain = subdomain_fixture()
      assert {:ok, %Subdomain{}} = Blog.delete_subdomain(subdomain)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_subdomain!(subdomain.id) end
    end

    test "change_subdomain/1 returns a subdomain changeset" do
      subdomain = subdomain_fixture()
      assert %Ecto.Changeset{} = Blog.change_subdomain(subdomain)
    end
  end
end
