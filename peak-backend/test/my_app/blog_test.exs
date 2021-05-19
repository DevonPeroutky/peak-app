defmodule MyApp.BlogTest do
  use MyApp.DataCase

  alias MyApp.Blog

  describe "subdomains" do
    alias MyApp.Blog.Subdomains

    @valid_attrs %{subdomain: "some subdomain", title: "some title"}
    @update_attrs %{subdomain: "some updated subdomain", title: "some updated title"}
    @invalid_attrs %{subdomain: nil, title: nil}

    def subdomains_fixture(attrs \\ %{}) do
      {:ok, subdomains} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_subdomains()

      subdomains
    end

    test "list_subdomains/0 returns all subdomains" do
      subdomains = subdomains_fixture()
      assert Blog.list_subdomains() == [subdomains]
    end

    test "get_subdomains!/1 returns the subdomains with given id" do
      subdomains = subdomains_fixture()
      assert Blog.get_subdomains!(subdomains.id) == subdomains
    end

    test "create_subdomains/1 with valid data creates a subdomains" do
      assert {:ok, %Subdomains{} = subdomains} = Blog.create_subdomains(@valid_attrs)
      assert subdomains.subdomain == "some subdomain"
      assert subdomains.title == "some title"
    end

    test "create_subdomains/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_subdomains(@invalid_attrs)
    end

    test "update_subdomains/2 with valid data updates the subdomains" do
      subdomains = subdomains_fixture()
      assert {:ok, %Subdomains{} = subdomains} = Blog.update_subdomains(subdomains, @update_attrs)
      assert subdomains.subdomain == "some updated subdomain"
      assert subdomains.title == "some updated title"
    end

    test "update_subdomains/2 with invalid data returns error changeset" do
      subdomains = subdomains_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_subdomains(subdomains, @invalid_attrs)
      assert subdomains == Blog.get_subdomains!(subdomains.id)
    end

    test "delete_subdomains/1 deletes the subdomains" do
      subdomains = subdomains_fixture()
      assert {:ok, %Subdomains{}} = Blog.delete_subdomains(subdomains)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_subdomains!(subdomains.id) end
    end

    test "change_subdomains/1 returns a subdomains changeset" do
      subdomains = subdomains_fixture()
      assert %Ecto.Changeset{} = Blog.change_subdomains(subdomains)
    end
  end
end
