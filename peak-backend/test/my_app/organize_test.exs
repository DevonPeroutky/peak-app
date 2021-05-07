defmodule MyApp.OrganizeTest do
  use MyApp.DataCase

  alias MyApp.Organize

  describe "tags" do
    alias MyApp.Organize.Tag

    @valid_attrs %{color: "some color", title: "some title"}
    @update_attrs %{color: "some updated color", title: "some updated title"}
    @invalid_attrs %{color: nil, title: nil}

    def tag_fixture(attrs \\ %{}) do
      {:ok, tag} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Organize.create_tag()

      tag
    end

    test "list_tags/0 returns all tags" do
      tag = tag_fixture()
      assert Organize.list_tags() == [tag]
    end

    test "get_tag!/1 returns the tag with given id" do
      tag = tag_fixture()
      assert Organize.get_tag!(tag.id) == tag
    end

    test "create_tag/1 with valid data creates a tag" do
      assert {:ok, %Tag{} = tag} = Organize.create_tag(@valid_attrs)
      assert tag.color == "some color"
      assert tag.title == "some title"
    end

    test "create_tag/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Organize.create_tag(@invalid_attrs)
    end

    test "update_tag/2 with valid data updates the tag" do
      tag = tag_fixture()
      assert {:ok, %Tag{} = tag} = Organize.update_tag(tag, @update_attrs)
      assert tag.color == "some updated color"
      assert tag.title == "some updated title"
    end

    test "update_tag/2 with invalid data returns error changeset" do
      tag = tag_fixture()
      assert {:error, %Ecto.Changeset{}} = Organize.update_tag(tag, @invalid_attrs)
      assert tag == Organize.get_tag!(tag.id)
    end

    test "delete_tag/1 deletes the tag" do
      tag = tag_fixture()
      assert {:ok, %Tag{}} = Organize.delete_tag(tag)
      assert_raise Ecto.NoResultsError, fn -> Organize.get_tag!(tag.id) end
    end

    test "change_tag/1 returns a tag changeset" do
      tag = tag_fixture()
      assert %Ecto.Changeset{} = Organize.change_tag(tag)
    end
  end
end
