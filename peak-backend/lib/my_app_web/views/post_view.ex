defmodule MyAppWeb.PostView do
  use MyAppWeb, :view
  alias MyAppWeb.PostView

  def render("index.json", %{posts: posts}) do
    %{posts: render_many(posts, PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{post: render_one(post, PostView, "post.json")}
  end

  def render("post.json", %{post: post}) do
    %{id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      cover_image: post.cover_image,
      snippet: post.snippet,
      created_at: post.inserted_at,
      updated_at: post.updated_at,
      body: post.body,
      tag_ids: post.tag_ids,
      user_id: post.user_id,
      visibility: post.visibility,
      post_type: post.post_type}
  end
end
