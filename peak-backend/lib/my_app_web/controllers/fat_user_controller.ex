defmodule MyAppWeb.FatUserController do
  use MyAppWeb, :controller

  require Logger
  alias MyApp.Auth
  alias MyApp.Reading
  alias MyApp.Organize
  alias MyApp.Wiki
  alias MyApp.Domains
  alias MyApp.Books
  alias MyApp.Library
  alias MyAppWeb.ScratchpadController

  action_fallback MyAppWeb.FallbackController

  def load_entire_state(conn, %{"user_id" => user_id}) do
    user = Auth.get_user!(user_id)
    topics = Domains.list_topics_with_pages_of_user(user_id)
    pages = Wiki.list_pages(user_id)
    tags = Organize.list_tags(user_id)
    future_reads = Reading.list_future_reads_of_user(user_id)
    %{entries: books, metadata: cursor_metadata} = Library.list_books(user_id, nil)

    scratchpad = case ScratchpadController.fetch_or_create_user_scratchpad(user_id) do
      {:ok, scratchpad} -> scratchpad
    end

    upload_token = case Goth.fetch(MyApp.Goth) do
      {:ok, token} -> Map.put(token, :token_type, "file_upload")
    end

    IO.inspect(upload_token)

    render(conn, "fat_user.json", %{
      user: user,
      topics: topics,
      future_reads: future_reads,
      pages: pages,
      tags: tags,
      books: books,
      scratchpad: scratchpad,
      tokens: [upload_token]
    })
  end
end
