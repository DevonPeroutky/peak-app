defmodule Api.PeakTelsaClient do
  use Tesla, only: [:get], docs: false

#  plug Tesla.Middleware.BaseUrl, "http://api.example.com"
#  plug Tesla.Middleware.JSON,
  plug Tesla.Middleware.FollowRedirects

  def fetch_data() do
    get("https://entrepreneurshandbook.co/a-web-designer-turned-his-side-project-into-a-700m-year-revenue-business-without-vc-money-55cd13ee560")
  end

  def fetch(url) do
    get(url)
  end
end