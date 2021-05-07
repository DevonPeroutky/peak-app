defmodule MyAppWeb.FatUserView do
  use MyAppWeb, :view
  alias MyAppWeb.UserView
  alias MyAppWeb.TopicView
  alias MyAppWeb.TagView
  alias MyAppWeb.FutureView
  alias MyAppWeb.PageView
  alias MyAppWeb.BookView
  alias MyAppWeb.ScratchpadView

  def render("fat_user.json", %{user: user, topics: topics, future_reads: future_reads, pages: pages, tags: tags, books: books, scratchpad: scratchpad}) do
    %{currentUser: render_one(user, UserView, "user.json"),
      topics: render_many(topics, TopicView, "topic.json"),
      futureReads: render_many(future_reads, FutureView, "future.json"),
      pages: render_many(pages, PageView, "page.json"),
      tags: render_many(tags, TagView, "tag.json"),
      notes: render_many(books, BookView, "book.json"),
      scratchpad: render_one(scratchpad, ScratchpadView, "scratchpad.json"),
    }
  end
end