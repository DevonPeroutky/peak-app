defmodule MyAppWeb.ScratchpadControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Notes
  alias MyApp.Notes.Scratchpad

  @create_attrs %{
    body: %{}
  }
  @update_attrs %{
    body: %{}
  }
  @invalid_attrs %{body: nil}

  def fixture(:scratchpad) do
    {:ok, scratchpad} = Notes.create_scratchpad(@create_attrs)
    scratchpad
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all scratchpad", %{conn: conn} do
      conn = get(conn, Routes.scratchpad_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create scratchpad" do
    test "renders scratchpad when data is valid", %{conn: conn} do
      conn = post(conn, Routes.scratchpad_path(conn, :create), scratchpad: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.scratchpad_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.scratchpad_path(conn, :create), scratchpad: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update scratchpad" do
    setup [:create_scratchpad]

    test "renders scratchpad when data is valid", %{conn: conn, scratchpad: %Scratchpad{id: id} = scratchpad} do
      conn = put(conn, Routes.scratchpad_path(conn, :update, scratchpad), scratchpad: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.scratchpad_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{}
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, scratchpad: scratchpad} do
      conn = put(conn, Routes.scratchpad_path(conn, :update, scratchpad), scratchpad: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete scratchpad" do
    setup [:create_scratchpad]

    test "deletes chosen scratchpad", %{conn: conn, scratchpad: scratchpad} do
      conn = delete(conn, Routes.scratchpad_path(conn, :delete, scratchpad))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.scratchpad_path(conn, :show, scratchpad))
      end
    end
  end

  defp create_scratchpad(_) do
    scratchpad = fixture(:scratchpad)
    %{scratchpad: scratchpad}
  end
end
