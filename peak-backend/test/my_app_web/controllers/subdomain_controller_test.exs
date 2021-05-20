defmodule MyAppWeb.SubdomainControllerTest do
  use MyAppWeb.ConnCase

  alias MyApp.Blog
  alias MyApp.Blog.Subdomain

  @create_attrs %{
    subdomain: "some subdomain",
    title: "some title"
  }
  @update_attrs %{
    subdomain: "some updated subdomain",
    title: "some updated title"
  }
  @invalid_attrs %{subdomain: nil, title: nil}

  def fixture(:subdomain) do
    {:ok, subdomain} = Blog.create_subdomain(@create_attrs)
    subdomain
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all subdomains", %{conn: conn} do
      conn = get(conn, Routes.subdomain_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create subdomain" do
    test "renders subdomain when data is valid", %{conn: conn} do
      conn = post(conn, Routes.subdomain_path(conn, :create), subdomain: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.subdomain_path(conn, :show, id))

      assert %{
               "id" => id,
               "subdomain" => "some subdomain",
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.subdomain_path(conn, :create), subdomain: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update subdomain" do
    setup [:create_subdomain]

    test "renders subdomain when data is valid", %{conn: conn, subdomain: %Subdomain{id: id} = subdomain} do
      conn = put(conn, Routes.subdomain_path(conn, :update, subdomain), subdomain: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.subdomain_path(conn, :show, id))

      assert %{
               "id" => id,
               "subdomain" => "some updated subdomain",
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, subdomain: subdomain} do
      conn = put(conn, Routes.subdomain_path(conn, :update, subdomain), subdomain: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete subdomain" do
    setup [:create_subdomain]

    test "deletes chosen subdomain", %{conn: conn, subdomain: subdomain} do
      conn = delete(conn, Routes.subdomain_path(conn, :delete, subdomain))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.subdomain_path(conn, :show, subdomain))
      end
    end
  end

  defp create_subdomain(_) do
    subdomain = fixture(:subdomain)
    %{subdomain: subdomain}
  end
end
