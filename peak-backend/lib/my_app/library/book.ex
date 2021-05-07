defmodule MyApp.Library.Book do
  use Ecto.Schema
  import Ecto.Changeset
  alias MyApp.Utils.StringUtils

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Jason.Encoder, only: [:id, :author, :body, :note_type, :url, :icon_url, :privacy_level, :title, :tag_ids]}
  schema "books" do
    field :author, :string, default: ""
    field :body, {:array, :map}, default: [%{"children": [%{"text" => ""}], "type": "p", "id": System.os_time(:millisecond)}]
    field :note_type, :string, null: false
    field :url, :string
    field :icon_url, :string, null: true
    field :description, :string, null: true
    field :cover_image_url, :string, null: true
    field :privacy_level, :string
    field :title, :string, null: false
    field :tag_ids, {:array, :string}, default: []
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:id, :title, :author, :body, :privacy_level, :user_id, :note_type, :url, :icon_url, :tag_ids, :description, :cover_image_url])
    |> validate_required([:title, :body, :user_id])
    |> update_change(:title, &String.downcase/1)
    |> update_change(:author, &String.downcase/1)
    |> update_change(:title, &StringUtils.truncate/1)
    |> update_change(:description, &StringUtils.truncate/1)
    |> IO.inspect
  end
end
