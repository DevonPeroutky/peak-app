defmodule MyApp.NotesTest do
  use MyApp.DataCase

  alias MyApp.Notes

  describe "scratchpad" do
    alias MyApp.Notes.Scratchpad

    @valid_attrs %{body: %{}}
    @update_attrs %{body: %{}}
    @invalid_attrs %{body: nil}

    def scratchpad_fixture(attrs \\ %{}) do
      {:ok, scratchpad} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Notes.create_scratchpad()

      scratchpad
    end

    test "list_scratchpad/0 returns all scratchpad" do
      scratchpad = scratchpad_fixture()
      assert Notes.list_scratchpad() == [scratchpad]
    end

    test "get_scratchpad!/1 returns the scratchpad with given id" do
      scratchpad = scratchpad_fixture()
      assert Notes.get_scratchpad!(scratchpad.id) == scratchpad
    end

    test "create_scratchpad/1 with valid data creates a scratchpad" do
      assert {:ok, %Scratchpad{} = scratchpad} = Notes.create_scratchpad(@valid_attrs)
      assert scratchpad.body == %{}
    end

    test "create_scratchpad/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Notes.create_scratchpad(@invalid_attrs)
    end

    test "update_scratchpad/2 with valid data updates the scratchpad" do
      scratchpad = scratchpad_fixture()
      assert {:ok, %Scratchpad{} = scratchpad} = Notes.update_scratchpad(scratchpad, @update_attrs)
      assert scratchpad.body == %{}
    end

    test "update_scratchpad/2 with invalid data returns error changeset" do
      scratchpad = scratchpad_fixture()
      assert {:error, %Ecto.Changeset{}} = Notes.update_scratchpad(scratchpad, @invalid_attrs)
      assert scratchpad == Notes.get_scratchpad!(scratchpad.id)
    end

    test "delete_scratchpad/1 deletes the scratchpad" do
      scratchpad = scratchpad_fixture()
      assert {:ok, %Scratchpad{}} = Notes.delete_scratchpad(scratchpad)
      assert_raise Ecto.NoResultsError, fn -> Notes.get_scratchpad!(scratchpad.id) end
    end

    test "change_scratchpad/1 returns a scratchpad changeset" do
      scratchpad = scratchpad_fixture()
      assert %Ecto.Changeset{} = Notes.change_scratchpad(scratchpad)
    end
  end
end
