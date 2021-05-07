defmodule MyApp.WikiTest do
  use MyApp.DataCase

  alias MyApp.Wiki

  describe "pages" do
    alias MyApp.Wiki.Page

    @valid_attrs %{body: %{}, privacy_level: "some privacy_level", title: "some title"}
    @update_attrs %{body: %{}, privacy_level: "some updated privacy_level", title: "some updated title"}
    @invalid_attrs %{body: nil, privacy_level: nil, title: nil}

    def page_fixture(attrs \\ %{}) do
      {:ok, page} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Wiki.create_page()

      page
    end

    test "list_pages/0 returns all pages" do
      page = page_fixture()
      assert Wiki.list_pages() == [page]
    end

    test "get_page!/1 returns the page with given id" do
      page = page_fixture()
      assert Wiki.get_page!(page.id) == page
    end

    test "create_page/1 with valid data creates a page" do
      assert {:ok, %Page{} = page} = Wiki.create_page(@valid_attrs)
      assert page.body == %{}
      assert page.privacy_level == "some privacy_level"
      assert page.title == "some title"
    end

    test "create_page/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Wiki.create_page(@invalid_attrs)
    end

    test "update_page/2 with valid data updates the page" do
      page = page_fixture()
      assert {:ok, %Page{} = page} = Wiki.update_page(page, @update_attrs)
      assert page.body == %{}
      assert page.privacy_level == "some updated privacy_level"
      assert page.title == "some updated title"
    end

    test "update_page/2 with invalid data returns error changeset" do
      page = page_fixture()
      assert {:error, %Ecto.Changeset{}} = Wiki.update_page(page, @invalid_attrs)
      assert page == Wiki.get_page!(page.id)
    end

    test "delete_page/1 deletes the page" do
      page = page_fixture()
      assert {:ok, %Page{}} = Wiki.delete_page(page)
      assert_raise Ecto.NoResultsError, fn -> Wiki.get_page!(page.id) end
    end

    test "change_page/1 returns a page changeset" do
      page = page_fixture()
      assert %Ecto.Changeset{} = Wiki.change_page(page)
    end
  end
end
