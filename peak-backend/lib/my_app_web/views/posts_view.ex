defmodule MyAppWeb.PostsView do
  use MyAppWeb, :view
  alias MyAppWeb.PostsView

  def render("index.json", %{blog_posts: blog_posts}) do
    %{data: render_many(blog_posts, PostsView, "posts.json")}
  end

  def render("show.json", %{posts: posts}) do
    %{data: render_one(posts, PostsView, "posts.json")}
  end

  def render("posts.json", %{posts: posts}) do
    %{id: posts.id,
      title: posts.title,
      subtitle: posts.subtitle,
      cover_image: posts.cover_image,
      logo: posts.logo,
      snippet: posts.snippet,
      body: posts.body,
      tag_ids: posts.tag_ids,
      visibility: posts.visibility,
      post_type: posts.post_type}
  end
end
