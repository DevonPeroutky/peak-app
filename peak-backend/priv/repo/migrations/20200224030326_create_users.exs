defmodule MyApp.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :string, primary_key: true
      add :peak_user_id, :binary_id, null: false
      add :email, :string, null: false
      add :image_url, :string, null: false
      add :one_time_code, :string, null: false
      add :given_name, :string, null: false
      add :family_name, :string, null: false
      add :access_token, :string, null: false
      add :hierarchy, {:array, :map}, null: false, default: []

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:access_token])
  end
end
