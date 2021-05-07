defmodule MyAppWeb.TopicController do
  require Logger
  use MyAppWeb, :controller

  alias UserAuth.AuthManager.Guardian

  alias MyApp.Auth
  alias MyApp.Domains
  alias MyApp.Domains.Topic
  alias MyApp.Wiki
  alias MyApp.Repo
  alias MyAppWeb.Utils.Hierarchy

  plug :put_view, MyAppWeb.HierarchyView
  plug :put_view, MyAppWeb.TopicView

  action_fallback MyAppWeb.FallbackController

  defp create_topic_and_add_to_hierarchy(new_topic_params \\ %{}) do
    user_id = new_topic_params["user_id"]

    Ecto.Multi.new()
    |> Ecto.Multi.run(:user, fn _repo, _changes_thus_far -> Auth.get_user(user_id)  end)
    |> Ecto.Multi.run(:topic, fn _repo, _changes_thus_far -> Domains.create_topic(new_topic_params) end)
    |> Ecto.Multi.run(:hierarchy, fn _repo, %{topic: topic, user: user} ->
      new_hierarchy = Hierarchy.add_topic_to_hierarchy(topic, user.hierarchy)
      case Auth.update_user(user, %{"hierarchy" => new_hierarchy}) do
        {:ok, updated_user} -> {:ok, updated_user.hierarchy}
        {:error, anything} -> {:error, anything}
      end
    end)
    |> Repo.transaction
  end

  defp update_topic_name_and_hierarchy(user_id, topic_id, new_topic_params \\ %{}) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:old_topic, fn _repo, _changes_thus_far -> Domains.get_topic(topic_id)  end)
    |> Ecto.Multi.run(:user, fn _repo, _changes_thus_far -> Auth.get_user(user_id)  end)
    |> Ecto.Multi.run(:updated_topic, fn _repo, %{old_topic: old_topic} -> Domains.update_topic(old_topic, new_topic_params) end)
    |> Ecto.Multi.run(:hierarchy, fn _repo, %{updated_topic: updated_topic, user: user} ->
      new_hierarchy = Hierarchy.update_topic_name_in_hierarchy(updated_topic, user.hierarchy)
      case Auth.update_user(user, %{"hierarchy" => new_hierarchy}) do
        {:ok, updated_user} -> {:ok, updated_user.hierarchy}
        {:error, anything} -> {:error, anything}
      end
    end)
    |> Repo.transaction
  end

  defp delete_topic_and_pages_and_remove_from_hierarchy(user_id, topic_id) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:topic, fn _repo, _changes_thus_far -> Domains.get_topic(topic_id)  end)
    |> Ecto.Multi.run(:pages_delete_result, fn _repo, _changes_thus_far -> Wiki.delete_pages_for_a_topic(topic_id) end)
    |> Ecto.Multi.run(:topic_delete_result, fn _repo, %{topic: topic} -> Domains.delete_topic(topic) end)
    |> Ecto.Multi.run(:user, fn _repo, _changes_thus_far -> Auth.get_user(user_id)  end)
    |> Ecto.Multi.run(:hierarchy, fn _repo, %{user: user} ->
      new_hierarchy = Hierarchy.remove_topic_from_hierarchy(topic_id, user.hierarchy)
      case Auth.update_user(user, %{"hierarchy" => new_hierarchy}) do
        {:ok, updated_user} -> {:ok, updated_user.hierarchy}
        {:error, anything} -> {:error, anything}
      end
    end)
    |> Repo.transaction
  end

  # ----------
  # Endpoints
  # ----------
  def create(conn, %{"topic" => topic_params, "user_id" => user_id}) do
    new_topic = Map.put(topic_params, "user_id", user_id)

    with {:ok, %{topic: topic, hierarchy: hierarchy}} <- create_topic_and_add_to_hierarchy(new_topic) do
      conn
      |> put_status(:created)
#      |> put_resp_header("location", Routes.user_topic_path(conn, :show, topic)) ToDO: ADD this back in appropriately
      |> render("topic_with_pages_and_hierarchy.json", %{topic: Map.put(topic, :pages, []), hierarchy: hierarchy})
    end
  end

  def index(conn, %{"user_id" => user_id}) do
    topics = Domains.list_topics_with_pages_of_user(user_id)
    render(conn, "index.json", topics: topics)
  end

  def show(conn, %{"user_id" => user_id, "id" => id}) do
    topic = Domains.get_topic!(id) # TODO, query off of user_id as well
    render(conn, "show.json", topic: topic)
  end

  def update(conn, %{"user_id" => user_id, "id" => id, "topic" => topic_params}) do
    with {:ok, %{updated_topic: topic, hierarchy: hierarchy}} <- update_topic_name_and_hierarchy(user_id, id, topic_params) do
      render(conn, "topic_with_hierarchy.json", %{topic: topic, hierarchy: hierarchy})
    end
  end

  """
  Delete the Topic and all of the pages
    1. Delete the pages
    2. Delete the topic
    3. Update the Hierarchy to filter out the topic which will remove the all of the pages
  """
  def delete(conn, %{"user_id" => user_id, "id" => id}) do
    with {:ok, %{hierarchy: hierarchy}} <- delete_topic_and_pages_and_remove_from_hierarchy(user_id, id) do
      render(conn, "hierarchy_only.json", %{hierarchy: hierarchy})
    end
  end
end
