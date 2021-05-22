defmodule MyApp.Auth do
  @moduledoc """
  The Auth context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Auth.User
  require Logger

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id) do
    user = Repo.get(User, id)
    case user do
      %User{} -> {:ok, user}
      _       -> {:error, :not_found}
    end
  end

  def get_all_accounts_for_user(peak_user_id) do
    from(b in User, select: b.id, where: b.peak_user_id == ^peak_user_id)
    |> Repo.all()
  end

  def get_user_by_one_time_code(one_time_code) do
    # They need to have generated the code within the last 5 minutes
    # TODO. Updated_at gets updated a lot outside of the session flow (ex. Hierarchy). The code needs it's own expiration date, or just use JWT
    expiration_window = DateTime.utc_now() |> DateTime.add(-300, :second)
    user = from(u in User, where: u.one_time_code == ^one_time_code and u.updated_at >= ^expiration_window)
    |> Repo.one

    case user do
      nil -> {:error, "One time code either did not exist, or it expired"}
      %User{} -> {:ok, user}
    end
  end

  def get_user_by_email(email) do
    Repo.get_by!(User, email: email)
  end

  def get_user_hierarchy(id) do
    get_user!(id).hierarchy
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end


  @doc """
  INSERTs a new user or updates the existing user's accessToken if the user already exists. Called after a user
  authenticates via Google Login.

  """
  def upsert_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert(
      on_conflict: [set: [access_token: Map.get(attrs, "access_token"), one_time_code: Map.get(attrs, "one_time_code"), updated_at: DateTime.utc_now]],
      conflict_target: [:id],
      returning: true
    )
  end

  def list_all_user_accounts(peak_user_id) do
    from(u in User, where: u.peak_user_id == ^peak_user_id, order_by: [desc: u.inserted_at])
    |> Repo.all()
  end
end
