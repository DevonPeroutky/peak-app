defmodule MyApp.Repo.Migrations.CreateTags do
  use Ecto.Migration

  def change do
    create table(:tags, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :color, :string, null: false
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false

      timestamps()
    end

    create index(:tags, [:user_id])
    create unique_index(:tags, [:user_id, :title], name: :unique_tag_per_user)
  end
end
