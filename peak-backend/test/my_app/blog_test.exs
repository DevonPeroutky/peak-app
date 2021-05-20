defmodule MyApp.BlogTest do
  use MyApp.DataCase

  alias MyApp.Blog

  describe "subdomains" do
    alias MyApp.Blog.Subdomain

    @valid_attrs %{subdomain: "some subdomain", title: "some title"}
    @update_attrs %{subdomain: "some updated subdomain", title: "some updated title"}
    @invalid_attrs %{subdomain: nil, title: nil}

    def subdomain_fixture(attrs \\ %{}) do
      {:ok, subdomain} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_subdomain()

      subdomain
    end

    test "list_subdomains/0 returns all subdomains" do
      subdomain = subdomain_fixture()
      assert Blog.list_subdomains() == [subdomain]
    end

    test "get_subdomain!/1 returns the subdomain with given id" do
      subdomain = subdomain_fixture()
      assert Blog.get_subdomain!(subdomain.id) == subdomain
    end

    test "create_subdomain/1 with valid data creates a subdomain" do
      assert {:ok, %Subdomain{} = subdomain} = Blog.create_subdomain(@valid_attrs)
      assert subdomain.subdomain == "some subdomain"
      assert subdomain.title == "some title"
    end

    test "create_subdomain/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_subdomain(@invalid_attrs)
    end

    test "update_subdomain/2 with valid data updates the subdomain" do
      subdomain = subdomain_fixture()
      assert {:ok, %Subdomain{} = subdomain} = Blog.update_subdomain(subdomain, @update_attrs)
      assert subdomain.subdomain == "some updated subdomain"
      assert subdomain.title == "some updated title"
    end

    test "update_subdomain/2 with invalid data returns error changeset" do
      subdomain = subdomain_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_subdomain(subdomain, @invalid_attrs)
      assert subdomain == Blog.get_subdomain!(subdomain.id)
    end

    test "delete_subdomain/1 deletes the subdomain" do
      subdomain = subdomain_fixture()
      assert {:ok, %Subdomain{}} = Blog.delete_subdomain(subdomain)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_subdomain!(subdomain.id) end
    end

    test "change_subdomain/1 returns a subdomain changeset" do
      subdomain = subdomain_fixture()
      assert %Ecto.Changeset{} = Blog.change_subdomain(subdomain)
    end
  end

  describe "posts" do
    alias MyApp.Blog.Post

    @valid_attrs %{body: %{}, cover_image: "some cover_image", logo: "some logo", post_type: "some post_type", snippet: "some snippet", subtitle: "some subtitle", tag_ids: [], title: "some title", visibility: "some visibility"}
    @update_attrs %{body: %{}, cover_image: "some updated cover_image", logo: "some updated logo", post_type: "some updated post_type", snippet: "some updated snippet", subtitle: "some updated subtitle", tag_ids: [], title: "some updated title", visibility: "some updated visibility"}
    @invalid_attrs %{body: nil, cover_image: nil, logo: nil, post_type: nil, snippet: nil, subtitle: nil, tag_ids: nil, title: nil, visibility: nil}

    def post_fixture(attrs \\ %{}) do
      {:ok, post} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_post()

      post
    end

    test "list_posts/0 returns all posts" do
      post = post_fixture()
      assert Blog.list_posts() == [post]
    end

    test "get_post!/1 returns the post with given id" do
      post = post_fixture()
      assert Blog.get_post!(post.id) == post
    end

    test "create_post/1 with valid data creates a post" do
      assert {:ok, %Post{} = post} = Blog.create_post(@valid_attrs)
      assert post.body == %{}
      assert post.cover_image == "some cover_image"
      assert post.logo == "some logo"
      assert post.post_type == "some post_type"
      assert post.snippet == "some snippet"
      assert post.subtitle == "some subtitle"
      assert post.tag_ids == []
      assert post.title == "some title"
      assert post.visibility == "some visibility"
    end

    test "create_post/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_post(@invalid_attrs)
    end

    test "update_post/2 with valid data updates the post" do
      post = post_fixture()
      assert {:ok, %Post{} = post} = Blog.update_post(post, @update_attrs)
      assert post.body == %{}
      assert post.cover_image == "some updated cover_image"
      assert post.logo == "some updated logo"
      assert post.post_type == "some updated post_type"
      assert post.snippet == "some updated snippet"
      assert post.subtitle == "some updated subtitle"
      assert post.tag_ids == []
      assert post.title == "some updated title"
      assert post.visibility == "some updated visibility"
    end

    test "update_post/2 with invalid data returns error changeset" do
      post = post_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_post(post, @invalid_attrs)
      assert post == Blog.get_post!(post.id)
    end

    test "delete_post/1 deletes the post" do
      post = post_fixture()
      assert {:ok, %Post{}} = Blog.delete_post(post)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_post!(post.id) end
    end

    test "change_post/1 returns a post changeset" do
      post = post_fixture()
      assert %Ecto.Changeset{} = Blog.change_post(post)
    end
  end
end
