defmodule MyApp.Repo.Migrations.CreateFutureReads do
  use Ecto.Migration

  def change do
    create table(:future_reads, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :url, :string, null: false
      add :content_type, :string, null: false
      add :date_added, :utc_datetime, null: false, default: fragment("now()")
      add :date_read, :utc_datetime
      add :topic_id, references(:topics, on_delete: :nothing, type: :binary_id)
      add :user_id, references(:users, on_delete: :nothing, type: :string)

      timestamps()
    end

    create index(:future_reads, [:topic_id])
    create index(:future_reads, [:user_id])
    create unique_index(:future_reads, [:user_id, :url], name: :unique_user_url)
  end
end
