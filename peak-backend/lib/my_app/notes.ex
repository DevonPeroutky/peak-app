defmodule MyApp.Notes do
  @moduledoc """
  The Notes context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Notes.Scratchpad

  @doc """
  Returns the list of scratchpad.

  ## Examples

      iex> list_scratchpad()
      [%Scratchpad{}, ...]

  """
  def list_scratchpad do
    Repo.all(Scratchpad)
  end

  @doc """
  Gets a single scratchpad.

  Raises `Ecto.NoResultsError` if the Scratchpad does not exist.

  ## Examples

      iex> get_scratchpad!(123)
      %Scratchpad{}

      iex> get_scratchpad!(456)
      ** (Ecto.NoResultsError)

  """
  def get_scratchpad!(user_id), do: Repo.get_by(Scratchpad, user_id: user_id)

  @doc """
  Gets the scratchpad for the user. Returns either the Scratchpad or nil

  ## Examples

      iex> get_scratchpad(123)
      %Scratchpad{}

      iex> get_scratchpad(456)
      nil

  """
  def get_scratchpad(user_id) do
    Repo.get_by(Scratchpad, user_id: user_id)
  end

  @doc """
  Creates a scratchpad.

  ## Examples

      iex> create_scratchpad(%{field: value})
      {:ok, %Scratchpad{}}

      iex> create_scratchpad(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_scratchpad(attrs \\ %{}) do
    %Scratchpad{}
    |> Scratchpad.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a scratchpad.

  ## Examples

      iex> update_scratchpad(scratchpad, %{field: new_value})
      {:ok, %Scratchpad{}}

      iex> update_scratchpad(scratchpad, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_scratchpad(%Scratchpad{} = scratchpad, attrs) do
    scratchpad
    |> Scratchpad.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a scratchpad.

  ## Examples

      iex> delete_scratchpad(scratchpad)
      {:ok, %Scratchpad{}}

      iex> delete_scratchpad(scratchpad)
      {:error, %Ecto.Changeset{}}

  """
  def delete_scratchpad(%Scratchpad{} = scratchpad) do
    Repo.delete(scratchpad)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking scratchpad changes.

  ## Examples

      iex> change_scratchpad(scratchpad)
      %Ecto.Changeset{data: %Scratchpad{}}

  """
  def change_scratchpad(%Scratchpad{} = scratchpad, attrs \\ %{}) do
    Scratchpad.changeset(scratchpad, attrs)
  end
end
