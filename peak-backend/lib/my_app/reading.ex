defmodule MyApp.Reading do
  @moduledoc """
  The Reading context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Reading.Future

  @doc """
  Returns the list of future_reads.

  ## Examples

      iex> list_future_reads()
      [%Future{}, ...]

  """
  def list_future_reads do
    Repo.all(Future)
  end

  @doc """
  Returns the list of future_reads for a user.

  ## Examples

      iex> list_future_reads()
      [%Future{}, ...]

  """
  def list_future_reads_of_user(user_id) do
    from(f in Future, where: f.user_id == ^user_id, order_by: :inserted_at)
    |> Repo.all()
    |> Repo.preload([:user])
  end

  def fetch_next_read_for_user(%{"user_id" => user_id, "topic_id" => "random-topic-69"}) do
    from(f in Future, where: f.user_id == ^user_id and is_nil(f.date_read))
    |> fetch_next_read()
  end

  def fetch_next_read_for_user(%{"user_id" => user_id, "topic_id" => topic_id}) do
    from(f in Future, where: f.user_id == ^user_id and f.topic_id  == ^topic_id and is_nil(f.date_read))
    |> fetch_next_read()
  end

  defp fetch_next_read(query) do
    query
    |> first(:inserted_at)
    |> Repo.one()
    |> Repo.preload([:user])
    |> Repo.preload([:topic])
  end

  @doc """
  Gets a single future.

  Raises `Ecto.NoResultsError` if the Future does not exist.

  ## Examples

      iex> get_future!(123)
      %Future{}

      iex> get_future!(456)
      ** (Ecto.NoResultsError)

  """
  def get_future!(id), do: Repo.get!(Future, id)

  @doc """
  Creates a future.

  ## Examples

      iex> create_future(%{field: value})
      {:ok, %Future{}}

      iex> create_future(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_future(attrs \\ %{}) do
    %Future{}
    |> Future.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a future.

  ## Examples

      iex> update_future(future, %{field: new_value})
      {:ok, %Future{}}

      iex> update_future(future, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_future(%Future{} = future, attrs) do
    future
    |> Future.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a future.

  ## Examples

      iex> delete_future(future)
      {:ok, %Future{}}

      iex> delete_future(future)
      {:error, %Ecto.Changeset{}}

  """
  def delete_future(%Future{} = future) do
    Repo.delete(future)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking future changes.

  ## Examples

      iex> change_future(future)
      %Ecto.Changeset{source: %Future{}}

  """
  def change_future(%Future{} = future) do
    Future.changeset(future, %{})
  end
end
