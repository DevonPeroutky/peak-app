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

  def get_subdomain!(user_id, subdomain) do
    from(s in Subdomain, where: s.user_id == ^user_id and s.subdomain == ^subdomain)
    |> Repo.one()
  end

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

  alias MyApp.Blog.Post

  @doc """
  Returns the list of posts.

  ## Examples

      iex> list_posts(subdomain)
      [%Post{}, ...]

  """
  def list_posts(subdomain) do
    from(p in Post, where: p.subdomain_id == ^subdomain, order_by: [desc: p.inserted_at])
    |> Repo.all()
  end

  @doc """
  Gets a single post.

  Raises `Ecto.NoResultsError` if the Post does not exist.

  ## Examples

      iex> get_post!(123)
      %Post{}

      iex> get_post!(456)
      ** (Ecto.NoResultsError)

  """
  def get_post!(id), do: Repo.get!(Post, id)

  @doc """
  Creates a post.

  ## Examples

      iex> create_post(%{field: value})
      {:ok, %Post{}}

      iex> create_post(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_post(attrs \\ %{}) do
    %Post{}
    |> Post.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a post.

  ## Examples

      iex> update_post(post, %{field: new_value})
      {:ok, %Post{}}

      iex> update_post(post, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_post(%Post{} = post, attrs) do
    post
    |> Post.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a post.

  ## Examples

      iex> delete_post(post)
      {:ok, %Post{}}

      iex> delete_post(post)
      {:error, %Ecto.Changeset{}}

  """
  def delete_post(%Post{} = post) do
    Repo.delete(post)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking post changes.

  ## Examples

      iex> change_post(post)
      %Ecto.Changeset{data: %Post{}}

  """
  def change_post(%Post{} = post, attrs \\ %{}) do
    Post.changeset(post, attrs)
  end
end
