defmodule MyApp.Journal.JournalEntry do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "journal_entries" do
    '''
    {
      type: ELEMENT_PARAGRAPH,
      children: [{text: 'A line of text in a paragraph.'}],
    }
    '''
    field :body, {:array, :map}, default: [%{"children": [%{"text" => ""}], "type": "p", "id": System.os_time(:millisecond)}]
    field :entry_date, :date
    belongs_to :user, MyApp.Auth.User, [foreign_key: :user_id, type: :string]

    timestamps()
  end

  @doc false
  def changeset(journal_entry, attrs) do
    journal_entry
    |> cast(attrs, [:body, :entry_date, :user_id])
    |> validate_required([:body, :entry_date, :user_id])
    |> unique_constraint(:user_journal_entry_unique_constraint, name: :unique_user_entry)
  end
end
