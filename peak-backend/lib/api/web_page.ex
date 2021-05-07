defmodule WebPageMetadata do
  defstruct title: nil, image_url: nil, description: nil, fav_icon_url: nil
end

defmodule DataFetcher.WebPage do
  require Logger
  alias Api.PeakTelsaClient

  defp fetch_html_from_url(url) do
    case Api.PeakTelsaClient.fetch(url) do
      {:ok, %Tesla.Env{status: success_code, body: body}} when success_code in 200..399 ->
        Logger.debug("Successfully fetched the html for #{url} with status code #{success_code}}")
        {:ok, body}
      {:ok, %Tesla.Env{status: success_code, body: body}} ->
        Logger.debug("Received an error code from the server at #{url}. Usually a private link")
        {:ok, body}
      {:error, reason} ->
        Logger.error("Unable to fetch the html for #{url}")
        Logger.error(reason)
        {:error, reason}
      {_, _} ->
        Logger.error("Completely unknown error #{url}")
        {:error, "Completely unknown"}
    end
  end

  defp parse_metadata_from_html(html_document, selector) do
    node = Floki.find(html_document, selector)
    case node do
      [] -> nil
      [{"meta", payload_list, []}] ->
        payload_list
        |> Enum.find(fn n -> elem(n, 0) == "content" end)
        |> elem(1)
      _ -> nil
    end
  end

  defp parse_favicon_from_html(html_document, html_element) do
    element = Floki.find(html_document, html_element)
    case element do
      [] -> nil
      [ { html_element, content, [] }] ->
        content
        |> Enum.find(fn n -> elem(n, 0) == "href" end)
        |> elem(1)
      _ -> nil
    end
  end

  defp parse_element_from_html(html_document, html_element) do
    element = Floki.find(html_document, html_element)
    case element do
      [] -> nil
      [ {html_element, [], [content]}] -> content
      _ -> nil
    end
  end

  @doc """
  Fetch the html source from the url and returns a WebPageMetadata

  ## Examples

      iex> fetch_metadata_for_url("https://medium.com")
      %WebPageMetadata{}

  """
  def fetch_metadata_for_url(url) do
    case fetch_html_from_url(url) do
      {:ok, html_document} ->
        case Floki.parse_document(html_document) do
          {:ok, html} ->
            Logger.debug("Successfully parsed the HTML document")
            og_description = parse_metadata_from_html(html, "meta[property='og:description']")
            og_image    = parse_metadata_from_html(html, "meta[property='og:image']")
            og_title    = parse_metadata_from_html(html, "meta[property='og:title']")
            fallback_description = parse_metadata_from_html(html, "meta[name='description']")
            fallback_title  = parse_element_from_html(html, "title")
            fav_icon = parse_favicon_from_html(html, "link[rel='icon']") |> IO.inspect
            fall_back_fav_icon = parse_favicon_from_html(html, "link[rel='shortcut icon']")

            title = if(og_title != nil, do: og_title, else: fallback_title)
            description = determine_description(og_description, fallback_description)
            fav_icon = determine_description(fav_icon, fall_back_fav_icon)
            {:ok, %WebPageMetadata{title: title, image_url: og_image, description: description, fav_icon_url: fav_icon}}
          {:error, reason} ->
            Logger.error("Error parsing the HTML document")
            {:error, reason}
        end
      {:error, reason} -> {:error, reason}
    end
  end

  defp determine_description(og_description, description) when og_description == nil do description end
  defp determine_description(og_description, description) when description == nil do og_description end
  defp determine_description(og_description, description) do
    if(String.length(og_description) > String.length(description), do: og_description, else: description)
  end
end
