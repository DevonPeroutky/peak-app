defmodule MyApp.Reading.Future do
  use Ecto.Schema
  import Ecto.Changeset
  alias MyApp.Utils.StringUtils

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "future_reads" do
    field :content_type, :string
    field :date_added, :utc_datetime
    field :date_read, :utc_datetime
    field :title, :string, default: "-"
    field :url, :string
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]
    belongs_to :topic, MyApp.Domains.Topic, [foreign_key: :topic_id, type: :binary_id]

    timestamps()
  end

  @doc false
  def changeset(future, attrs) do
    future
    |> cast(attrs, [:title, :url, :content_type, :date_added, :date_read, :user_id, :topic_id])
    |> validate_required([:url, :content_type, :user_id])
    |> update_change(:title, &StringUtils.truncate/1)
    |> set_title_if_empty()
    |> unique_constraint(:user_url_unique_constraint, name: :unique_user_url)
  end

  def set_title_if_empty(changeset) do
    title = get_field(changeset, :title)

    if is_nil(title) do
      put_change(changeset, :title, "-")
    else
      changeset
    end
  end
end
