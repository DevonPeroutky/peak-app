defmodule MyAppWeb.LinkMetadataController do
  use MyAppWeb, :controller

  alias MyApp.WebpageMetadata
  alias DataFetcher.WebPage

  action_fallback MyAppWeb.FallbackController

  def fetch_link_metadata(conn, %{"user_id" => user_id, "url" => url}) do
    with {:ok, %WebPageMetadata{} = link_metadata} <- DataFetcher.WebPage.fetch_metadata_for_url(url) do
      render(conn, "link_metadata.json", link_metadata: link_metadata)
    end
  end
end
