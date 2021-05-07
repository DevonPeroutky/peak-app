defmodule MyApp.Repo.Migrations.CreateTopics do
  use Ecto.Migration

  def change do
    create table(:topics, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :color, :string, null: false
      add :privacy_level, :string, null: false
      add :hierarchy, {:array, :map}, null: false, default: []
      add :user_id, references(:users, on_delete: :nothing, type: :string), null: false

      timestamps()
    end

    create index(:topics, [:user_id])
    create unique_index(:topics, [:user_id, :name], name: :unique_user_topic)
  end
end
