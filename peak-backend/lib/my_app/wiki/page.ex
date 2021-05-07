defmodule MyApp.Wiki.Page do
  use Ecto.Schema
  import Ecto.Changeset
  alias MyApp.Utils.StringUtils

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "pages" do
    field :body, {:array, :map}
    field :privacy_level, :string
    field :title, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]
    belongs_to :topic, MyApp.Domains.Topic, [foreign_key: :topic_id, type: :binary_id]

    timestamps()
  end

  @doc false
  def changeset(page, attrs) do
    page
    |> cast(attrs, [:body, :title, :privacy_level, :user_id, :topic_id])
    |> update_change(:title, &StringUtils.truncate/1)
    |> validate_required([:body, :privacy_level, :user_id])
  end
end
