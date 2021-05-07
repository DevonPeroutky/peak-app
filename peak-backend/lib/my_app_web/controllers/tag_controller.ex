defmodule MyAppWeb.TagController do
  use MyAppWeb, :controller

  alias MyApp.Organize
  alias MyApp.Organize.Tag

  action_fallback MyAppWeb.FallbackController

  def index(conn, %{"user_id" => user_id}) do
    tags = Organize.list_tags(user_id)
    render(conn, "index.json", tags: tags)
  end

  def fetch_tags(user_id, tag_ids) do
    Organize.fetch_tags(user_id, tag_ids)
  end

  def create(conn, %{"user_id" => user_id, "tags" => tag_params}) do
    create_tag_response = tag_params
    |> Enum.map(fn t -> Organize.create_tag(Map.put(t, "user_id", user_id)) end)

    error = create_tag_response
    |> Keyword.keys()
    |> IO.inspect
    |> Enum.any?(fn res_status -> res_status == :error end)
    |> IO.inspect

    if (error) do
      send_resp(conn, 409, "Probably trying to create a tag that already exists")
    else
      created_tags = create_tag_response
                     |> IO.inspect
                     |> Keyword.values()
                     |> IO.inspect

      with {:ok, tags} <- { :ok, created_tags } do
        conn
        |> put_status(:created)
        |> render("index.json", tags: tags)
      end
    end
  end

  def show(conn, %{"id" => id}) do
    tag = Organize.get_tag!(id)
    render(conn, "show.json", tag: tag)
  end

  def update(conn, %{"id" => id, "tag" => tag_params}) do
    tag = Organize.get_tag!(id)

    with {:ok, %Tag{} = tag} <- Organize.update_tag(tag, tag_params) do
      render(conn, "show.json", tag: tag)
    end
  end

  def delete(conn, %{"id" => id}) do
    tag = Organize.get_tag!(id)

    with {:ok, %Tag{}} <- Organize.delete_tag(tag) do
      send_resp(conn, :no_content, "")
    end
  end
end
