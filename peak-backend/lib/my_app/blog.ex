defmodule MyApp.Blog do
  @moduledoc """
  The Blog context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Blog.Subdomain

  @doc """
  Returns the list of subdomains.

  ## Examples

      iex> list_subdomains()
      [%Subdomain{}, ...]

  """
  def list_subdomains do
    Repo.all(Subdomain)
  end

  @doc """
  Gets a single subdomain.

  Raises `Ecto.NoResultsError` if the Subdomain does not exist.

  ## Examples

      iex> get_subdomain!(123)
      %Subdomain{}

      iex> get_subdomain!(456)
      ** (Ecto.NoResultsError)

  """
  def get_subdomain!(id), do: Repo.get!(Subdomain, id)

  @doc """
  Creates a subdomain.

  ## Examples

      iex> create_subdomain(%{field: value})
      {:ok, %Subdomain{}}

      iex> create_subdomain(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_subdomain(attrs \\ %{}) do
    %Subdomain{}
    |> Subdomain.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a subdomain.

  ## Examples

      iex> update_subdomain(subdomain, %{field: new_value})
      {:ok, %Subdomain{}}

      iex> update_subdomain(subdomain, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_subdomain(%Subdomain{} = subdomain, attrs) do
    subdomain
    |> Subdomain.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a subdomain.

  ## Examples

      iex> delete_subdomain(subdomain)
      {:ok, %Subdomain{}}

      iex> delete_subdomain(subdomain)
      {:error, %Ecto.Changeset{}}

  """
  def delete_subdomain(%Subdomain{} = subdomain) do
    Repo.delete(subdomain)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking subdomain changes.

  ## Examples

      iex> change_subdomain(subdomain)
      %Ecto.Changeset{data: %Subdomain{}}

  """
  def change_subdomain(%Subdomain{} = subdomain, attrs \\ %{}) do
    Subdomain.changeset(subdomain, attrs)
  end
end
