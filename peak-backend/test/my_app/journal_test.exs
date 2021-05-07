defmodule MyApp.JournalTest do
  use MyApp.DataCase

  alias MyApp.Journal

  describe "journal_entries" do
    alias MyApp.Journal.JournalEntry

    @valid_attrs %{body: %{}, entry_date: ~D[2010-04-17], title: "some title"}
    @update_attrs %{body: %{}, entry_date: ~D[2011-05-18], title: "some updated title"}
    @invalid_attrs %{body: nil, entry_date: nil, title: nil}

    def journal_entry_fixture(attrs \\ %{}) do
      {:ok, journal_entry} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Journal.create_journal_entry()

      journal_entry
    end

    test "list_journal_entries/0 returns all journal_entries" do
      journal_entry = journal_entry_fixture()
      assert Journal.list_journal_entries() == [journal_entry]
    end

    test "get_journal_entry!/1 returns the journal_entry with given id" do
      journal_entry = journal_entry_fixture()
      assert Journal.get_journal_entry!(journal_entry.id) == journal_entry
    end

    test "create_journal_entry/1 with valid data creates a journal_entry" do
      assert {:ok, %JournalEntry{} = journal_entry} = Journal.create_journal_entry(@valid_attrs)
      assert journal_entry.body == %{}
      assert journal_entry.entry_date == ~D[2010-04-17]
      assert journal_entry.title == "some title"
    end

    test "create_journal_entry/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Journal.create_journal_entry(@invalid_attrs)
    end

    test "update_journal_entry/2 with valid data updates the journal_entry" do
      journal_entry = journal_entry_fixture()
      assert {:ok, %JournalEntry{} = journal_entry} = Journal.update_journal_entry(journal_entry, @update_attrs)
      assert journal_entry.body == %{}
      assert journal_entry.entry_date == ~D[2011-05-18]
      assert journal_entry.title == "some updated title"
    end

    test "update_journal_entry/2 with invalid data returns error changeset" do
      journal_entry = journal_entry_fixture()
      assert {:error, %Ecto.Changeset{}} = Journal.update_journal_entry(journal_entry, @invalid_attrs)
      assert journal_entry == Journal.get_journal_entry!(journal_entry.id)
    end

    test "delete_journal_entry/1 deletes the journal_entry" do
      journal_entry = journal_entry_fixture()
      assert {:ok, %JournalEntry{}} = Journal.delete_journal_entry(journal_entry)
      assert_raise Ecto.NoResultsError, fn -> Journal.get_journal_entry!(journal_entry.id) end
    end

    test "change_journal_entry/1 returns a journal_entry changeset" do
      journal_entry = journal_entry_fixture()
      assert %Ecto.Changeset{} = Journal.change_journal_entry(journal_entry)
    end
  end
end
