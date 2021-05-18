defmodule MyApp.Blog.Posts do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "blog_posts" do
    field :body, :map
    field :cover_image, :string
    field :logo, :string
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
  def changeset(posts, attrs) do
    posts
    |> cast(attrs, [:title, :subtitle, :cover_image, :logo, :snippet, :body, :tag_ids, :visibility, :post_type])
    |> validate_required([:title, :subtitle, :cover_image, :logo, :snippet, :body, :tag_ids, :visibility, :post_type])
  end
end
