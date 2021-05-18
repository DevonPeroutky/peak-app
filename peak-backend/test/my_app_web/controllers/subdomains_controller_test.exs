defmodule MyAppWeb.SubdomainsControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Blog
  alias MyApp.Blog.Subdomains

  @create_attrs %{
    subdomain: "some subdomain",
    title: "some title"
  }
  @update_attrs %{
    subdomain: "some updated subdomain",
    title: "some updated title"
  }
  @invalid_attrs %{subdomain: nil, title: nil}

  def fixture(:subdomains) do
    {:ok, subdomains} = Blog.create_subdomains(@create_attrs)
    subdomains
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all subdomains", %{conn: conn} do
      conn = get(conn, Routes.subdomains_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create subdomains" do
    test "renders subdomains when data is valid", %{conn: conn} do
      conn = post(conn, Routes.subdomains_path(conn, :create), subdomains: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.subdomains_path(conn, :show, id))

      assert %{
               "id" => id,
               "subdomain" => "some subdomain",
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.subdomains_path(conn, :create), subdomains: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update subdomains" do
    setup [:create_subdomains]

    test "renders subdomains when data is valid", %{conn: conn, subdomains: %Subdomains{id: id} = subdomains} do
      conn = put(conn, Routes.subdomains_path(conn, :update, subdomains), subdomains: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.subdomains_path(conn, :show, id))

      assert %{
               "id" => id,
               "subdomain" => "some updated subdomain",
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, subdomains: subdomains} do
      conn = put(conn, Routes.subdomains_path(conn, :update, subdomains), subdomains: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete subdomains" do
    setup [:create_subdomains]

    test "deletes chosen subdomains", %{conn: conn, subdomains: subdomains} do
      conn = delete(conn, Routes.subdomains_path(conn, :delete, subdomains))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.subdomains_path(conn, :show, subdomains))
      end
    end
  end

  defp create_subdomains(_) do
    subdomains = fixture(:subdomains)
    %{subdomains: subdomains}
  end
end
