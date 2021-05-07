defmodule MyAppWeb.JournalEntryView do
  use MyAppWeb, :view
  alias MyAppWeb.JournalEntryView

  def render("index.json", %{journal_entries: journal_entries}) do
    %{journal_entries: render_many(journal_entries, JournalEntryView, "journal_entry.json")}
  end

  def render("show.json", %{journal_entry: journal_entry}) do
    %{journal_entry: render_one(journal_entry, JournalEntryView, "journal_entry.json")}
  end

  def render("journal_entry.json", %{journal_entry: journal_entry}) do
    %{id: journal_entry.id,
      body: journal_entry.body,
      entry_date: journal_entry.entry_date}
  end
end
