defmodule MyAppWeb.FutureView do
  use MyAppWeb, :view
  alias MyAppWeb.FutureView

  def render("index.json", %{future_reads: future_reads}) do
    %{data: render_many(future_reads, FutureView, "future.json")}
  end

  def render("show.json", %{future: future}) do
    %{data: render_one(future, FutureView, "future.json")}
  end

  def render("future.json", %{future: future}) do
    %{id: future.id,
      title: future.title,
      url: future.url,
      content_type: future.content_type,
      user_id: future.user_id,
      topic_id: future.topic_id,
      date_added: future.date_added,
      date_read: future.date_read}
  end
end
