defmodule MyApp.Wiki do
  @moduledoc """
  The Wiki context.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo

  alias MyApp.Wiki.Page

  @doc """
  Returns the list of pages.

  ## Examples

      iex> list_pages()
      [%Page{}, ...]

  """
  def list_pages(user_id) do
    from(p in Page, where: p.user_id == ^user_id, order_by: [desc: p.inserted_at])
    |> Repo.all()
  end

  @doc """
  Gets a single page.

  Raises `Ecto.NoResultsError` if the Page does not exist.

  ## Examples

      iex> get_page!(123)
      %Page{}

      iex> get_page!(456)
      ** (Ecto.NoResultsError)

  """
  def get_page!(id), do: Repo.get!(Page, id)

  def get_page(id) do
    page = Repo.get!(Page, id)
    case page do
      %Page{} -> {:ok, page}
      _       -> {:error, "Unable to query page with id: #{id}"}
    end
  end


  @doc """
  Creates a page.

  ## Examples

      iex> create_page(%{field: value})
      {:ok, %Page{}}

      iex> create_page(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_page(attrs \\ %{}) do
    IO.puts "Creating the page"
    IO.inspect attrs
    %Page{}
    |> Page.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a page.

  ## Examples

      iex> update_page(page, %{field: new_value})
      {:ok, %Page{}}

      iex> update_page(page, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_page(%Page{} = page, attrs) do
    page
    |> Page.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a page.

  ## Examples

      iex> delete_page(page)
      {:ok, %Page{}}

      iex> delete_page(page)
      {:error, %Ecto.Changeset{}}

  """
  def delete_page(%Page{} = page) do
    Repo.delete(page)
  end

  @doc """
  Deletes all the pages for a topic.

  ## Examples

      iex> delete_page(page)
      {:ok, %Page{}}

      iex> delete_page(page)
      {:error, %Ecto.Changeset{}}

  """
  def delete_pages_for_a_topic(topic_id) do
    query_result = from(p in Page, where: p.topic_id == ^topic_id)
    |> Repo.delete_all()

    case query_result do
      {_, nil} -> {:ok, topic_id}
      _       -> {:error, "Unable to delete pages with topic_id: #{topic_id}"}
    end
  end


  @doc """
  Returns an `%Ecto.Changeset{}` for tracking page changes.

  ## Examples

      iex> change_page(page)
      %Ecto.Changeset{source: %Page{}}

  """
  def change_page(%Page{} = page) do
    Page.changeset(page, %{})
  end
end
