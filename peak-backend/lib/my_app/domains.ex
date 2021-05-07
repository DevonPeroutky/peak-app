defmodule MyApp.Domains do
  @moduledoc """
  The Domains context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Domains.Topic
  alias MyApp.Wiki.Page

  @doc """
  Returns the list of topics.

  ## Examples

      iex> list_topics()
      [%Topic{}, ...]

  """
  def list_topics do
    from(t in Topic, order_by: [desc: t.inserted_at])
    Repo.all(Topic)
    |> Repo.all()
  end

  def list_topics_with_pages_of_user(user_id) do
    list_merge = fn x, y -> %{x | pages: x.pages ++ y.pages} end
    reduce_pages = fn topic -> Map.replace!(topic, :pages, Enum.filter(topic.pages, fn x -> x.page_id != nil end)) end

    from(t in Topic, left_join: p in Page, on: t.id == p.topic_id, where: t.user_id == ^user_id, select: %{name: t.name, id: t.id, inserted_at: t.inserted_at, color: t.color, privacy_level: t.privacy_level, hierarchy: t.hierarchy, user_id: t.user_id, pages: [%{page_title: p.title, page_id: p.id, date_created: p.inserted_at}]}, order_by: [desc: t.inserted_at])
    |> Repo.all()
    |> Enum.map(reduce_pages)
    |> Enum.group_by(&(&1.id))
    |> Map.values()
    |> Enum.map(fn (theList) -> Enum.reduce(theList, fn x, y -> list_merge.(x, y) end) end)
  end

  @doc """
  Gets a single topic.

  Raises `Ecto.NoResultsError` if the Topic does not exist.

  ## Examples

      iex> get_topic!(123)
      %Topic{}

      iex> get_topic!(456)
      ** (Ecto.NoResultsError)

  """
  def get_topic!(id), do: Repo.get!(Topic, id)

  def get_topic(id) do
    user = Repo.get!(Topic, id)
    case user do
      %Topic{} -> {:ok, user}
      _       -> {:error, "Unable to query topic with id: #{id}"}
    end
  end

  @doc """
  Creates a topic.

  ## Examples

      iex> create_topic(%{field: value})
      {:ok, %Topic{}}

      iex> create_topic(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_topic(attrs \\ %{}) do
    %Topic{}
    |> Topic.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a topic.

  ## Examples

      iex> update_topic(topic, %{field: new_value})
      {:ok, %Topic{}}

      iex> update_topic(topic, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_topic(%Topic{} = topic, attrs) do
    topic
    |> Topic.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a topic.

  ## Examples

      iex> delete_topic(topic)
      {:ok, %Topic{}}

      iex> delete_topic(topic)
      {:error, %Ecto.Changeset{}}

  """
  def delete_topic(%Topic{} = topic) do
    Repo.delete(topic)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking topic changes.

  ## Examples

      iex> change_topic(topic)
      %Ecto.Changeset{source: %Topic{}}

  """
  def change_topic(%Topic{} = topic) do
    Topic.changeset(topic, %{})
  end
end
