defmodule MyAppWeb.PageControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Wiki
  alias MyApp.Wiki.Page

  @create_attrs %{
    body: %{},
    privacy_level: "some privacy_level",
    title: "some title"
  }
  @update_attrs %{
    body: %{},
    privacy_level: "some updated privacy_level",
    title: "some updated title"
  }
  @invalid_attrs %{body: nil, privacy_level: nil, title: nil}

  def fixture(:page) do
    {:ok, page} = Wiki.create_page(@create_attrs)
    page
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all pages", %{conn: conn} do
      conn = get(conn, Routes.page_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create page" do
    test "renders page when data is valid", %{conn: conn} do
      conn = post(conn, Routes.page_path(conn, :create), page: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.page_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => %{},
               "privacy_level" => "some privacy_level",
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.page_path(conn, :create), page: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update page" do
    setup [:create_page]

    test "renders page when data is valid", %{conn: conn, page: %Page{id: id} = page} do
      conn = put(conn, Routes.page_path(conn, :update, page), page: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.page_path(conn, :show, id))

      assert %{
               "id" => id,
               "body" => {},
               "privacy_level" => "some updated privacy_level",
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, page: page} do
      conn = put(conn, Routes.page_path(conn, :update, page), page: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete page" do
    setup [:create_page]

    test "deletes chosen page", %{conn: conn, page: page} do
      conn = delete(conn, Routes.page_path(conn, :delete, page))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.page_path(conn, :show, page))
      end
    end
  end

  defp create_page(_) do
    page = fixture(:page)
    {:ok, page: page}
  end
end
