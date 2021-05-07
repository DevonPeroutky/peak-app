defmodule MyAppWeb.BookController do
  require Logger
  use MyAppWeb, :controller

  alias MyApp.Library
  alias MyApp.Auth
  alias MyApp.Library.Book
  alias MyApp.Repo
  alias MyAppWeb.TagController
  alias MyAppWeb.Utils.NodeUtils
  alias DataFetcher.WebPage

  action_fallback MyAppWeb.FallbackController

  defp get_base_url(url) do
    url |> String.split("#") |> List.first
  end

  def index(conn, %{"user_id" => user_id, "cursor" => cursor}) do
    %{entries: books, metadata: cursor_metadata} = Library.list_books(user_id, cursor)
    render(conn, "paginated_index.json", %{books: books, cursor_metadata: cursor_metadata})
  end

  def index(conn, %{"user_id" => user_id}) do
    %{entries: books, metadata: cursor_metadata} = Library.list_books(user_id, nil)
    render(conn, "paginated_index.json", %{books: books, cursor_metadata: cursor_metadata})
  end

  # Creates the Books from the app
  def create(conn, %{"user_id" => user_id, "book" => book_params}) do
    book_map = book_params |> Map.put("user_id", user_id) |> IO.inspect
    with {:ok, %Book{} = book} <- Library.create_book(book_map) do
      conn
      |> put_status(:created)
      |> render("show.json", book: book)
    end
  end

  # TODO Explicitly list out note_params for "safety"
  # Creates the WebNotes from the Extension
  def create(conn, %{"user_id" => user_id, "note" => note_params, "entry_date" => entry_date}) do
    with {:ok, %{book: note, tags: tags}} <- upsert_note(user_id, entry_date, note_params) do
      note_map = Map.from_struct(note) |> Map.put("note_id", note.id) |> Map.delete(:__meta__) |> Map.delete(:user)
      MyAppWeb.Endpoint.broadcast("journal:" <> user_id, "web_note_created", %{note: note_map, tags: tags})

      conn
      |> put_status(:created)
      |> render("show.json", book: note)
    end
  end

  def upsert_note(user_id, entry_date, note_params) do
#    node_id = :os.system_time(:millisecond)
    tag_ids = Enum.map(note_params["selected_tags"], fn t -> t["id"] end)

    Ecto.Multi.new()
    |> Ecto.Multi.run(:note, fn _repo, _changes_thus_far ->
      children_body = List.first(note_params["body"])["children"]
      augmentations = case DataFetcher.WebPage.fetch_metadata_for_url(note_params["url"]) do
        {:ok, metadata} ->
          augmentations = %{
            "body" => children_body,
            "tag_ids" => tag_ids,
            "description" => metadata.description,
            "cover_image_url" => metadata.image_url
          }
        {:error, reason} ->
          augmentations = %{
            "body" => children_body,
            "tag_ids" => tag_ids
          }
      end
      {:ok, Map.merge(note_params, augmentations) } |> IO.inspect
    end)
    |> Ecto.Multi.run(:book, fn _repo, %{note: note} ->
      create_or_append_to_book(user_id, note) end)
    |> Ecto.Multi.run(:tags, fn _repo, _change_thus_far -> {:ok, TagController.fetch_tags(user_id, tag_ids)} end)
#    |> Ecto.Multi.run(:nodes_appended, fn _repo, %{book: book, note: note} ->
#      node_to_append = book
#                       |> Map.from_struct
#                       |> Map.delete(:__meta__)
#                       |> Map.delete(:user)
#                       |> Map.delete(:inserted_at)
#                       |> Map.put(:note_id, book.id)
#                       |> Map.put(:type, book.note_type)
#                       |> Map.put(:children, note["body"])
#                       |> Map.put(:selected_tags, note["selected_tags"])
#                       |> Map.put(:privacy_level, book.privacy_level)
#                       |> Map.put(:id, node_id)
#                       |> Map.delete(:body)
#                       |> Map.delete(:note_type)
#                       |> IO.inspect
#
#      JournalEntryController.append_note_to_current_journal_entry(user_id, entry_date, node_to_append)
#    end)
    |> Repo.transaction

  end

  defp create_or_append_to_book(user_id, note_params) do
    # Was this a good idea?
    # url_hash_agnostic = note_params["url"] |> String.split("#") |> List.first
    case Library.fetch_book_by_url(user_id, note_params["url"]) do
      :nil ->
        Logger.info("Creating a new book from scratch")
        note = note_params |> Map.put("user_id", user_id) |> IO.inspect
        Library.create_book(note)
      book ->
        Logger.info("Appending to existing book")
        is_existing_node_empty = NodeUtils.is_node_empty(book.body) |> IO.inspect
        is_new_note_empty = NodeUtils.is_node_empty(note_params["body"]) |> IO.inspect

        new_title = note_params["title"]
        new_tag_ids = note_params["tag_ids"] ++ book.tag_ids |> Enum.uniq
        buffer_node_list = [NodeUtils.paragraph_buffer_node()] |> IO.inspect

        new_book_body = case { is_existing_node_empty, is_new_note_empty} do
          # If new_note is empty --> Don't update the body
          {_, true} -> book.body

          # If new_note is not empty, but existing_note is --> Replace
          {true, false} -> note_params["body"] ++ buffer_node_list

          # If new_note and existing_note are both not empty --> Append
          {false, false} ->
            book.body ++ note_params["body"]
        end

        IO.puts "NEW BOOK BODY"
        IO.inspect new_book_body
        Library.update_book(book, %{"body" => new_book_body, "tag_ids" => new_tag_ids, "title" => new_title})
    end
  end

  def show(conn, %{"id" => id}) do
    book = Library.get_book!(id)
    render(conn, "show.json", book: book)
  end

  def update(conn, %{"id" => id, "book" => book_params}) do
    IO.puts "Updating the Boook/Note"
    IO.inspect book_params
    book = Library.get_book!(id)

    with {:ok, %Book{} = book} <- Library.update_book(book, book_params) do
      render(conn, "show.json", book: book)
    end
  end

  def delete(conn, %{"user_id" => user_id, "id" => id}) do
    book = Library.get_book!(id)

    with {:ok, %Book{}} <- Library.delete_book(book) do
      MyAppWeb.Endpoint.broadcast("journal:" <> user_id, "delete_bookmark", %{noteId: id})
      send_resp(conn, :no_content, "")
    end
  end

  def fetch_latest_webnote(conn, %{"user_id" => user_id, "peak_user_id" => peak_user_id}) do
    newest_note_across_all_accounts = Auth.get_all_accounts_for_user(peak_user_id)
    |> Library.fetch_newest_web_note()

    render(conn, "show.json", book: newest_note_across_all_accounts)
  end

  ## -----------
  ## Deprecated
  ## -----------
  @deprecated "Not longer need to do this, since no longer embedded notes/books in editors"
  defp find_and_update_contents_of_peak_book(_user_id, new_book_note) do
    case Repo.get(Book, new_book_note["book_id"]) do
      :nil ->
        IO.puts("No book with ID #{new_book_note["book_id"]}")
      book ->
        IO.puts("We Got a Book ")
        Library.update_book(book, %{"body" => new_book_note["children"]})
    end
  end

  @deprecated "Not longer need to do this, since no longer embedded notes/books in editors"
  def update_contents_of_book_notes(%{"user_id" => user_id, "book_notes" => book_notes}) do
    IO.puts "Updating contents of any of the notes"
    IO.inspect book_notes
    Enum.each(book_notes, fn n -> find_and_update_contents_of_peak_book(user_id, n) end)
  end

end
