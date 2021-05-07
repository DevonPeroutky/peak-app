defmodule MyApp.Library do
  @moduledoc """
  The Library context.
  """
  import Ecto.Query, warn: false
  alias MyApp.Repo
  alias MyApp.Library.Book

  @page_size 25

  @doc """
  Returns the list of books. This is paginated

  ## Examples

      iex> list_books(user_id, nil)
      [%Book{}, ...]

      iex> list_books(user_id, "your_cursor_here")
      [%Book{}, ...]

  """
  def list_books(user_id, cursor) do
    query = from(b in Book, where: b.user_id == ^user_id, order_by: [desc: b.inserted_at])
    fetch_books(query, cursor)
  end

  defp fetch_books(query, cursor) when is_nil(cursor) do
    Repo.paginate(query, cursor_fields: [{:inserted_at, :desc}, {:id, :desc}], limit: @page_size)
  end

  defp fetch_books(query, cursor) do
    Repo.paginate(query, after: cursor, cursor_fields: [{:inserted_at, :desc}, {:id, :desc}], limit: @page_size)
  end

  def fetch_newest_web_note(accounts) do
    from(b in Book, where: b.user_id in ^accounts and b.note_type == ^MyApp.Constant.web_note, order_by: [desc: b.inserted_at])
    |> first()
    |> Repo.one()
  end

  def fetch_book_by_url(user_id, url) do
    IO.puts "Fetching book from #{user_id} and #{url}"
#    from(b in Book, where: b.user_id == ^user_id and ilike(b.url, ^"#{url}%"))
    from(b in Book, where: b.user_id == ^user_id and b.url == ^"#{url}")
    |> Repo.one()
  end

  @doc """
  Gets a single book.

  Raises `Ecto.NoResultsError` if the Book does not exist.

  ## Examples

      iex> get_book!(123)
      %Book{}

      iex> get_book!(456)
      ** (Ecto.NoResultsError)

  """
  def get_book!(id), do: Repo.get!(Book, id)

  @doc """
  Creates a book.

  ## Examples

      iex> create_book(%{field: value})
      {:ok, %Book{}}

      iex> create_book(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_book(attrs \\ %{}) do
    %Book{}
    |> Book.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a book.

  ## Examples

      iex> update_book(book, %{field: new_value})
      {:ok, %Book{}}

      iex> update_book(book, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_book(%Book{} = book, attrs) do
    book
    |> Book.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a book.

  ## Examples

      iex> delete_book(book)
      {:ok, %Book{}}

      iex> delete_book(book)
      {:error, %Ecto.Changeset{}}

  """
  def delete_book(%Book{} = book) do
    Repo.delete(book)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking book changes.

  ## Examples

      iex> change_book(book)
      %Ecto.Changeset{source: %Book{}}

  """
  def change_book(%Book{} = book) do
    Book.changeset(book, %{})
  end
end
