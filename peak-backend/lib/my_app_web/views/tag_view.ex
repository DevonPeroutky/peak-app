defmodule MyAppWeb.TagView do
  use MyAppWeb, :view
  alias MyAppWeb.TagView

  def render("index.json", %{tags: tags}) do
    %{tags: render_many(tags, TagView, "tag.json")}
  end

  def render("show.json", %{tag: tag}) do
    %{tag: render_one(tag, TagView, "tag.json")}
  end

  def render("tag.json", %{tag: tag}) do
    %{id: tag.id,
      title: tag.title,
      inserted_at: NaiveDateTime.to_iso8601(tag.inserted_at),
      color: tag.color}
  end
end
