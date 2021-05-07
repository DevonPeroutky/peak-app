defmodule MyAppWeb.JournalEntryControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Journal
  alias MyApp.Journal.JournalEntry

  @create_attrs %{
    body: %{},
    entry_date: ~D[2010-04-17],
    title: "some title"
  }
  @update_attrs %{
    body: %{},
    entry_date: ~D[2011-05-18],
    title: "some updated title"
  }
  @invalid_attrs %{body: nil, entry_date: nil, title: nil}

  def fixture(:journal_entry) do
    {:ok, journal_entry} = Journal.create_journal_entry(@create_attrs)
    journal_entry
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all journal_entries", %{conn: conn} do
      conn = get(conn, Routes.journal_entry_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create journal_entry" do
    test "renders journal_entry when data is valid", %{conn: conn} do
      conn = post(conn, Routes.journal_entry_path(conn, :create), journal_entry: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.journal_entry_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{},
               "entry_date" => "2010-04-17",
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.journal_entry_path(conn, :create), journal_entry: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update journal_entry" do
    setup [:create_journal_entry]

    test "renders journal_entry when data is valid", %{conn: conn, journal_entry: %JournalEntry{id: id} = journal_entry} do
      conn = put(conn, Routes.journal_entry_path(conn, :update, journal_entry), journal_entry: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.journal_entry_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => {},
               "entry_date" => "2011-05-18",
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, journal_entry: journal_entry} do
      conn = put(conn, Routes.journal_entry_path(conn, :update, journal_entry), journal_entry: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete journal_entry" do
    setup [:create_journal_entry]

    test "deletes chosen journal_entry", %{conn: conn, journal_entry: journal_entry} do
      conn = delete(conn, Routes.journal_entry_path(conn, :delete, journal_entry))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.journal_entry_path(conn, :show, journal_entry))
      end
    end
  end

  defp create_journal_entry(_) do
    journal_entry = fixture(:journal_entry)
    {:ok, journal_entry: journal_entry}
  end
end
