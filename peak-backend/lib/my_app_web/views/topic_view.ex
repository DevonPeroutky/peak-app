defmodule MyAppWeb.TopicView do
  use MyAppWeb, :view
  alias MyAppWeb.TopicView

  def render("skinny_topic.json", %{topic: topic}) do
    %{id: topic.id,
      name: topic.name,
      color: topic.color,
      user_id: topic.user_id,
      privacy_level: topic.privacy_level,
      inserted_at: topic.inserted_at,
      hierarchy: topic.hierarchy}
  end

  def render("topic_with_pages_and_hierarchy.json", %{topic: topic, hierarchy: hierarchy}) do
    %{
      topic: render("topic_with_page.json", topic),
      hierarchy: hierarchy
    }
  end

  def render("topic_with_hierarchy.json", %{topic: topic, hierarchy: hierarchy}) do
    %{
      topic: render("show.json", %{topic: topic}),
      hierarchy: hierarchy
    }
  end

  def render("topic.json", %{topic: topic}) do
    %{id: topic.id,
      name: topic.name,
      color: topic.color,
      user_id: topic.user_id,
      privacy_level: topic.privacy_level,
      inserted_at: topic.inserted_at,
      pages: render_many(topic.pages, TopicView, "page_stub.json"),
      hierarchy: topic.hierarchy}
  end

  def render("page_stub.json", %{topic: topic}) do
    %{id: topic.page_id,
      inserted_at: topic.date_created,
      title: topic.page_title}
  end

  def render("topic_with_page.json", topic) do
    %{id: topic.id,
      name: topic.name,
      inserted_at: topic.inserted_at,
      color: topic.color,
      user_id: topic.user_id,
      privacy_level: topic.privacy_level,
      pages: render_many(topic.pages, TopicView, "page_stub.json")}
  end

  def render("index.json", %{topics: topics}) do
    %{topics: render_many(topics, TopicView, "topic.json")}
  end

  def render("show.json", %{topic: topic}) do
    render_one(topic, TopicView, "skinny_topic.json")
  end

  def render("user_topic_with_pages.json", %{topics: topics_with_pages}) do
    %{topics: render_many(topics_with_pages, TopicView, "topic_with_page.json")}
  end

  def render("hierarchy_only.json", %{hierarchy: hierarchy}) do
    %{hierarchy: hierarchy}
  end
end
