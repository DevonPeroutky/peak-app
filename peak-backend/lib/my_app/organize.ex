defmodule MyApp.Organize do
  @moduledoc """
  The Organize context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Organize.Tag

  @doc """
  Returns the list of tags.

  ## Examples

      iex> list_tags(user_id)
      [%Tag{}, ...]

  """
  def list_tags(user_id) do
    from(t in Tag, where: t.user_id == ^user_id, order_by: [desc: t.inserted_at])
    |> Repo.all()
  end

  @doc """
  Returns the list of specified tags.

  ## Examples

      iex> fetch_tags(user_id, tag_ids)
      [%Tag{}, ...]

  """
  def fetch_tags(user_id, tag_ids) do
    from(t in Tag, where: t.user_id == ^user_id and t.id in ^tag_ids, order_by: [desc: t.inserted_at])
    |> Repo.all()
  end

  @doc """
  Gets a single tag.

  Raises `Ecto.NoResultsError` if the Tag does not exist.

  ## Examples

      iex> get_tag!(123)
      %Tag{}

      iex> get_tag!(456)
      ** (Ecto.NoResultsError)

  """
  def get_tag!(id), do: Repo.get!(Tag, id)

  @doc """
  Creates a tag.

  ## Examples

      iex> create_tag(%{field: value})
      {:ok, %Tag{}}

      iex> create_tag(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_tag(attrs \\ %{}) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a tag.

  ## Examples

      iex> update_tag(tag, %{field: new_value})
      {:ok, %Tag{}}

      iex> update_tag(tag, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_tag(%Tag{} = tag, attrs) do
    tag
    |> Tag.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a tag.

  ## Examples

      iex> delete_tag(tag)
      {:ok, %Tag{}}

      iex> delete_tag(tag)
      {:error, %Ecto.Changeset{}}

  """
  def delete_tag(%Tag{} = tag) do
    Repo.delete(tag)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking tag changes.

  ## Examples

      iex> change_tag(tag)
      %Ecto.Changeset{source: %Tag{}}

  """
  def change_tag(%Tag{} = tag) do
    Tag.changeset(tag, %{})
  end
end
