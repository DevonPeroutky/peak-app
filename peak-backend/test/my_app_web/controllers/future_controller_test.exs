defmodule MyAppWeb.FutureControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Reading
  alias MyApp.Reading.Future

  @create_attrs %{
    content_type: "some content_type",
    date_added: "2010-04-17T14:00:00Z",
    date_read: "2010-04-17T14:00:00Z",
    title: "some title",
    url: "some url"
  }
  @update_attrs %{
    content_type: "some updated content_type",
    date_added: "2011-05-18T15:01:01Z",
    date_read: "2011-05-18T15:01:01Z",
    title: "some updated title",
    url: "some updated url"
  }
  @invalid_attrs %{content_type: nil, date_added: nil, date_read: nil, title: nil, url: nil}

  def fixture(:future) do
    {:ok, future} = Reading.create_future(@create_attrs)
    future
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all future_reads", %{conn: conn} do
      conn = get(conn, Routes.future_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create future" do
    test "renders future when data is valid", %{conn: conn} do
      conn = post(conn, Routes.future_path(conn, :create), future: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.future_path(conn, :show, id))

      assert %{
               "id" => id,
               "content_type" => "some content_type",
               "date_added" => "2010-04-17T14:00:00Z",
               "date_read" => "2010-04-17T14:00:00Z",
               "title" => "some title",
               "url" => "some url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.future_path(conn, :create), future: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update future" do
    setup [:create_future]

    test "renders future when data is valid", %{conn: conn, future: %Future{id: id} = future} do
      conn = put(conn, Routes.future_path(conn, :update, future), future: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.future_path(conn, :show, id))

      assert %{
               "id" => id,
               "content_type" => "some updated content_type",
               "date_added" => "2011-05-18T15:01:01Z",
               "date_read" => "2011-05-18T15:01:01Z",
               "title" => "some updated title",
               "url" => "some updated url"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, future: future} do
      conn = put(conn, Routes.future_path(conn, :update, future), future: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete future" do
    setup [:create_future]

    test "deletes chosen future", %{conn: conn, future: future} do
      conn = delete(conn, Routes.future_path(conn, :delete, future))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.future_path(conn, :show, future))
      end
    end
  end

  defp create_future(_) do
    future = fixture(:future)
    {:ok, future: future}
  end
end
