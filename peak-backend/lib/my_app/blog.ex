defmodule MyApp.Blog do
  @moduledoc """
  The Blog context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Blog.Subdomains

  @doc """
  Returns the list of subdomains.

  ## Examples

      iex> list_subdomains()
      [%Subdomains{}, ...]

  """
  def list_subdomains do
    Repo.all(Subdomains)
  end

  @doc """
  Gets a single subdomains.

  Raises `Ecto.NoResultsError` if the Subdomains does not exist.

  ## Examples

      iex> get_subdomains!(123)
      %Subdomains{}

      iex> get_subdomains!(456)
      ** (Ecto.NoResultsError)

  """
  def get_subdomains!(id), do: Repo.get!(Subdomains, id)

  @doc """
  Creates a subdomains.

  ## Examples

      iex> create_subdomains(%{field: value})
      {:ok, %Subdomains{}}

      iex> create_subdomains(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_subdomains(attrs \\ %{}) do
    %Subdomains{}
    |> Subdomains.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a subdomains.

  ## Examples

      iex> update_subdomains(subdomains, %{field: new_value})
      {:ok, %Subdomains{}}

      iex> update_subdomains(subdomains, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_subdomains(%Subdomains{} = subdomains, attrs) do
    subdomains
    |> Subdomains.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a subdomains.

  ## Examples

      iex> delete_subdomains(subdomains)
      {:ok, %Subdomains{}}

      iex> delete_subdomains(subdomains)
      {:error, %Ecto.Changeset{}}

  """
  def delete_subdomains(%Subdomains{} = subdomains) do
    Repo.delete(subdomains)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking subdomains changes.

  ## Examples

      iex> change_subdomains(subdomains)
      %Ecto.Changeset{data: %Subdomains{}}

  """
  def change_subdomains(%Subdomains{} = subdomains, attrs \\ %{}) do
    Subdomains.changeset(subdomains, attrs)
  end
end
