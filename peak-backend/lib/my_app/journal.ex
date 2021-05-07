defmodule MyApp.Journal do
  @moduledoc """
  The Journal context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Journal.JournalEntry

  @doc """
  Returns the list of journal_entries for a user_id.

  ## Examples

      iex> list_journal_entries()
      [%JournalEntry{}, ...]

  """
  def list_journal_entries(user_id, entry_date) do

    IO.puts("Fetching list of journal entries for #{user_id} starting at #{entry_date}")
    from(j in JournalEntry, where: j.user_id == ^user_id and j.entry_date <= ^entry_date, order_by: [desc: :entry_date], limit: 5)
    |> Repo.all
  end

  @doc """
  Gets a single journal_entry.

  Raises `Ecto.NoResultsError` if the Journal entry does not exist.

  ## Examples

      iex> get_journal_entry!(123)
      %JournalEntry{}

      iex> get_journal_entry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_journal_entry!(id), do: Repo.get!(JournalEntry, id)

  @doc """
  Gets a single journal_entry by the date.

  Raises `Ecto.NoResultsError` if the Journal entry does not exist.

  ## Examples

      iex> get_journal_entry!(123)
      %JournalEntry{}

      iex> get_journal_entry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_journal_entry_by_date(user_id, entry_date) do
#    journal_entry = Repo.get_by(JournalEntry, entry_date: entry_date, user_id: user_id)
#    case journal_entry do
#      %JournalEntry{} -> {:ok, journal_entry}
#      _               -> {:error, "Unable to query user with id: #{user_id}"}
#    end
    Repo.get_by(JournalEntry, entry_date: entry_date, user_id: user_id)
  end

  @doc """
  Creates a journal_entry.

  ## Examples

      iex> create_journal_entry(%{field: value})
      {:ok, %JournalEntry{}}

      iex> create_journal_entry(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_journal_entry(attrs \\ %{}) do
    %JournalEntry{}
    |> JournalEntry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a journal_entry.

  ## Examples

      iex> update_journal_entry(journal_entry, %{field: new_value})
      {:ok, %JournalEntry{}}

      iex> update_journal_entry(journal_entry, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_journal_entry(%JournalEntry{} = journal_entry, attrs) do
    journal_entry
    |> JournalEntry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a journal_entry.

  ## Examples

      iex> delete_journal_entry(journal_entry)
      {:ok, %JournalEntry{}}

      iex> delete_journal_entry(journal_entry)
      {:error, %Ecto.Changeset{}}

  """
  def delete_journal_entry(%JournalEntry{} = journal_entry) do
    Repo.delete(journal_entry)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking journal_entry changes.

  ## Examples

      iex> change_journal_entry(journal_entry)
      %Ecto.Changeset{source: %JournalEntry{}}

  """
  def change_journal_entry(%JournalEntry{} = journal_entry) do
    JournalEntry.changeset(journal_entry, %{})
  end
end
