defmodule MyApp.Repo.Migrations.MakeUrlsTexts do
  use Ecto.Migration

  def change do
    alter table(:books) do
      modify :icon_url, :text
      modify :cover_image_url, :text
    end
  end
end
