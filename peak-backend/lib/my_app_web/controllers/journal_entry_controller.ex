defmodule MyAppWeb.JournalEntryController do
  use MyAppWeb, :controller

  alias MyApp.Journal
  alias MyApp.Journal.JournalEntry
  alias MyApp.Library.Book

  action_fallback MyAppWeb.FallbackController

  # Empty body
  # [%{children: [%{"text" => ""}], id: 1609745541701, type: "p"}]
  def is_node_empty(node) do
    if is_list(node) && length(node) == 1 do

      # IF indexed by "children"
      att1 = Enum.at(node, 0)["children"]
      if att1 != nil do
        Enum.at(att1,0)["text"] == ""
      else
        # IF indexed by children:
        att2 = Enum.at(node, 0).children
        Enum.at(att2, 0)["text"] == ""
      end
    else
      false
    end
  end

  defp fetch_journal_and_maybe_create_entry_for_today(user_id, entry_date, should_create) do
    journal_entries = Journal.list_journal_entries(user_id, entry_date)

    if (should_create && !does_today_exist(entry_date, journal_entries)) do
      created_journal_entry = Journal.create_journal_entry(%{user_id: user_id, entry_date: entry_date})
      case created_journal_entry do
        {:ok, today_journal_entry} ->
          IO.puts("Created a journal entry for #{entry_date}")
          {:ok, [today_journal_entry | journal_entries]}
        {:error, _} ->
          IO.puts("Unexpected error creating Journal Entry for #{entry_date}")
          created_journal_entry
      end
    else
      {:ok, journal_entries}
    end
  end

  defp does_today_exist(entry_date_str, journal_entries) do
    latest_entry = List.first(journal_entries)

    if (latest_entry == :nil) do
      false
    else
      case Date.from_iso8601(entry_date_str) do
        {:ok, entry_date} ->
          Date.compare(entry_date, latest_entry.entry_date)
          |> case do
             :eq -> true
             _ -> false
          end
        _ ->
          IO.puts("Invalid entry_date?? #{entry_date_str}")
          false
      end
    end
  end

  def index(conn, %{"user_id" => user_id, "read_only" => read_only, "entry_date" => entry_date}) do
    journal_entries = fetch_journal_and_maybe_create_entry_for_today(user_id, entry_date, read_only == "false")

    with {:ok, journal_entries} <- journal_entries do
      render(conn, "index.json", journal_entries: journal_entries)
    end
  end

  def create(conn, %{"journal_entry" => journal_entry_params}) do
    with {:ok, %JournalEntry{} = journal_entry} <- Journal.create_journal_entry(journal_entry_params) do
      conn
      |> put_status(:created)
#      |> put_resp_header("location", Routes.journal_entry_path(conn, :show, journal_entry))
      |> render("show.json", journal_entry: journal_entry)
    end
  end

  def show(conn, %{"id" => id}) do
    journal_entry = Journal.get_journal_entry!(id)
    render(conn, "show.json", journal_entry: journal_entry)
  end

  def update(conn, %{"id" => id, "journal_entry" => journal_entry_params}) do
    journal_entry = Journal.get_journal_entry!(id)

    with {:ok, %JournalEntry{} = journal_entry} <- Journal.update_journal_entry(journal_entry, journal_entry_params) do
      render(conn, "show.json", journal_entry: journal_entry)
    end
  end

  defp fetch_and_update_journal_entry(%{"user_id" => user_id, "entry_date" => entry_date, "body" => new_body}) do

    ## TODO: PUt this in a TXN
#    MyAppWeb.BookController.update_contents_of_book_notes(%{"user_id" => user_id, "book_notes" => notes})

    Journal.get_journal_entry_by_date(user_id, entry_date)
    |> Journal.update_journal_entry(%{body: new_body})
    |> elem(1)
  end

  def bulk_update_journal(conn, %{"user_id" => user_id, "journal_entries" => journal_entries}) do
    updated_journal_entries = Enum.map(journal_entries,  fn (entry) -> fetch_and_update_journal_entry(Map.put(entry, "user_id", user_id)) end)
    with {:ok, journal_entries} <- {:ok, updated_journal_entries} do
      render(conn, "index.json", journal_entries: journal_entries)
    end
  end

  def delete(conn, %{"id" => id}) do
    journal_entry = Journal.get_journal_entry!(id)
    with {:ok, %JournalEntry{}} <- Journal.delete_journal_entry(journal_entry) do
      send_resp(conn, :no_content, "")
    end
  end

  def append_note_to_current_journal_entry(user_id, entry_date, node_to_append) do
    today = fetch_journal_and_maybe_create_entry_for_today(user_id, entry_date, "false")
    |> elem(1)
    |> List.first

    paragraph_buffer_node = %{"children": [%{"text" => ""}], "type": "p", "id": System.os_time(:millisecond)}

    existing_body = today.body
    web_note_with_buffer = if is_node_empty(existing_body), do: [node_to_append, paragraph_buffer_node], else: [paragraph_buffer_node, node_to_append, paragraph_buffer_node]

    IO.puts "NEW Journal BADDY"
    new_body = existing_body ++ web_note_with_buffer |> IO.inspect

    case Journal.update_journal_entry(today, %{body: new_body}) do
      {:ok, updated_journal_entry} -> {:ok, web_note_with_buffer}
      {:error, reason} -> {:error, "Failed to append to Journal"}
    end
  end


  ## -----------
  ## Deprecated
  ## -----------
  @deprecated "Not longer need to do this, since no longer embedded notes/books in editors"
  defp get_note_nodes_from_journal_entry(journal_entry_body) do
    journal_entry_body
    |> Enum.filter(fn  n -> n["type"] == "peak_book_note" || n["type"] == "peak_web_note" end)
  end
end
