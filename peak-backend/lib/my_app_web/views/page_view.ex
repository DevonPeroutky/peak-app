defmodule MyAppWeb.PageView do
  use MyAppWeb, :view
  alias MyAppWeb.PageView

  def render("index.json", %{pages: pages}) do
    %{pages: render_many(pages, PageView, "page.json")}
  end

  def render("show.json", %{page: page}) do
    %{page: render_one(page, PageView, "page.json")}
  end

  def render("page.json", %{page: page}) do
    %{id: page.id,
      body: page.body,
      title: page.title,
      inserted_at: page.inserted_at,
      privacy_level: page.privacy_level}
  end

  def render("page_with_hierarchy.json", %{page: page, hierarchy: hierarchy}) do
    %{
      page: render_one(page, PageView, "page.json"),
      hierarchy: hierarchy
    }
  end

  def render("hierarchy_only.json", %{hierarchy: hierarchy}) do
    %{hierarchy: hierarchy}
  end
end
