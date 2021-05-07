defmodule BackfillScript do
  alias MyApp.Journal

  def backfill_journal(user_id, start_date, end_date) do
    IO.puts "Starting"
    {:ok, start} = Date.from_iso8601(start_date)
    {:ok, finish} = Date.from_iso8601(end_date)

    Enum.each(Date.range(start, finish), fn entry_date ->
      IO.puts("Journal Entry for #{entry_date}")
      Journal.create_journal_entry(%{user_id: user_id, entry_date: entry_date})
    end)
    IO.puts "Done"
  end

end

BackfillScript.backfill_journal("74c26bbe-53e0-43ac-92ee-d080362b9702", "2020-08-01", "2020-09-10")
Enum.each(Date.range(start, finish), fn entry_date ->
  IO.puts("Journal Entry for #{entry_date}")
  Journal.create_journal_entry(%{user_id: user_id, entry_date: entry_date})
end)