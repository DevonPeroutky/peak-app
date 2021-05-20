defmodule MyApp.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string
      add :subtitle, :text
      add :cover_image, :string
      add :snippet, :text
      add :body, {:array, :map}, null: false
      add :tag_ids, {:array, :binary_id}
      add :visibility, :string
      add :post_type, :string
      add :subdomain, references(:subdomains, column: :subdomain, on_delete: :nothing, type: :string)
      add :user_id, references(:users, on_delete: :nothing, type: :string)

      timestamps()
    end

    create index(:posts, [:subdomain])
    create index(:posts, [:user_id])
  end
end
