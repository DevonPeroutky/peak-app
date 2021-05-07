defmodule MyAppWeb.BookView do
  use MyAppWeb, :view
  alias MyAppWeb.BookView

  def render("paginated_index.json", %{books: books, cursor_metadata: cursor_metadata}) do
    %{
      books: render_many(books, BookView, "book.json"),
      pagination_metadata: %{
        cursor: cursor_metadata.after,
        cursorBefore: cursor_metadata.before,
        limit: cursor_metadata.limit
      }
    }
  end

  def render("cursor_metadata.json", cursor_metadata) do
    %{
      after: cursor_metadata.after,
      before: cursor_metadata.before,
      limit: cursor_metadata.limit
    }
  end

  def render("index.json", %{books: books}) do
    %{books: render_many(books, BookView, "book.json")}
  end

  def render("show.json", %{book: book}) do
    %{book: render_one(book, BookView, "book.json")}
  end

  def render("book.json", %{book: book}) do
    %{id: book.id,
      title: book.title,
      author: book.author,
      note_type: book.note_type,
      icon_url: book.icon_url,
      cover_image_url: book.cover_image_url,
      description: book.description,
      tag_ids: book.tag_ids,
      url: book.url,
      body: book.body,
      user_id: book.user_id,
      updated_at: book.updated_at,
      inserted_at: book.inserted_at,
      privacy_level: book.privacy_level}
  end
end
