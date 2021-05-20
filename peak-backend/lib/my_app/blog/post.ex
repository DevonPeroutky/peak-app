defmodule MyApp.Blog.Post do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "posts" do
    field :body, {:array, :map}
    field :cover_image, :string
    field :post_type, :string
    field :snippet, :string
    field :subtitle, :string
    field :tag_ids, {:array, :binary_id}
    field :title, :string
    field :visibility, :string
    field :subdomain, :binary_id
    field :user_id, :binary_id

    timestamps()
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:title, :subtitle, :cover_image, :snippet, :body, :tag_ids, :visibility, :post_type])
    |> validate_required([:title, :body, :tag_ids, :visibility, :post_type])
  end
end
