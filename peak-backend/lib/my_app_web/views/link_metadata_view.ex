defmodule MyAppWeb.LinkMetadataView do
  use MyAppWeb, :view
  alias MyAppWeb.LinkMetadataView

  def render("index.json", %{link_metadata: link_metadata}) do
    %{data: render_many(link_metadata, LinkMetadataView, "link_metadata.json")}
  end

  def render("link_metadata.json", %{link_metadata: link_metadata}) do
    %{
      title: link_metadata.title,
      description: link_metadata.description,
      cover_image_url: link_metadata.image_url,
      fav_icon_url: link_metadata.fav_icon_url}
  end
end
