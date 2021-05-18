defmodule MyApp.BlogTest do
  use MyApp.DataCase

  alias MyApp.Blog

  describe "subdomains" do
    alias MyApp.Blog.Subdomains

    @valid_attrs %{subdomain: "some subdomain", title: "some title"}
    @update_attrs %{subdomain: "some updated subdomain", title: "some updated title"}
    @invalid_attrs %{subdomain: nil, title: nil}

    def subdomains_fixture(attrs \\ %{}) do
      {:ok, subdomains} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_subdomains()

      subdomains
    end

    test "list_subdomains/0 returns all subdomains" do
      subdomains = subdomains_fixture()
      assert Blog.list_subdomains() == [subdomains]
    end

    test "get_subdomains!/1 returns the subdomains with given id" do
      subdomains = subdomains_fixture()
      assert Blog.get_subdomains!(subdomains.id) == subdomains
    end

    test "create_subdomains/1 with valid data creates a subdomains" do
      assert {:ok, %Subdomains{} = subdomains} = Blog.create_subdomains(@valid_attrs)
      assert subdomains.subdomain == "some subdomain"
      assert subdomains.title == "some title"
    end

    test "create_subdomains/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_subdomains(@invalid_attrs)
    end

    test "update_subdomains/2 with valid data updates the subdomains" do
      subdomains = subdomains_fixture()
      assert {:ok, %Subdomains{} = subdomains} = Blog.update_subdomains(subdomains, @update_attrs)
      assert subdomains.subdomain == "some updated subdomain"
      assert subdomains.title == "some updated title"
    end

    test "update_subdomains/2 with invalid data returns error changeset" do
      subdomains = subdomains_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_subdomains(subdomains, @invalid_attrs)
      assert subdomains == Blog.get_subdomains!(subdomains.id)
    end

    test "delete_subdomains/1 deletes the subdomains" do
      subdomains = subdomains_fixture()
      assert {:ok, %Subdomains{}} = Blog.delete_subdomains(subdomains)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_subdomains!(subdomains.id) end
    end

    test "change_subdomains/1 returns a subdomains changeset" do
      subdomains = subdomains_fixture()
      assert %Ecto.Changeset{} = Blog.change_subdomains(subdomains)
    end
  end

  describe "blog_posts" do
    alias MyApp.Blog.Posts

    @valid_attrs %{body: %{}, cover_image: "some cover_image", logo: "some logo", post_type: "some post_type", snippet: "some snippet", subtitle: "some subtitle", tag_ids: [], title: "some title", visibility: "some visibility"}
    @update_attrs %{body: %{}, cover_image: "some updated cover_image", logo: "some updated logo", post_type: "some updated post_type", snippet: "some updated snippet", subtitle: "some updated subtitle", tag_ids: [], title: "some updated title", visibility: "some updated visibility"}
    @invalid_attrs %{body: nil, cover_image: nil, logo: nil, post_type: nil, snippet: nil, subtitle: nil, tag_ids: nil, title: nil, visibility: nil}

    def posts_fixture(attrs \\ %{}) do
      {:ok, posts} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Blog.create_posts()

      posts
    end

    test "list_blog_posts/0 returns all blog_posts" do
      posts = posts_fixture()
      assert Blog.list_blog_posts() == [posts]
    end

    test "get_posts!/1 returns the posts with given id" do
      posts = posts_fixture()
      assert Blog.get_posts!(posts.id) == posts
    end

    test "create_posts/1 with valid data creates a posts" do
      assert {:ok, %Posts{} = posts} = Blog.create_posts(@valid_attrs)
      assert posts.body == %{}
      assert posts.cover_image == "some cover_image"
      assert posts.logo == "some logo"
      assert posts.post_type == "some post_type"
      assert posts.snippet == "some snippet"
      assert posts.subtitle == "some subtitle"
      assert posts.tag_ids == []
      assert posts.title == "some title"
      assert posts.visibility == "some visibility"
    end

    test "create_posts/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Blog.create_posts(@invalid_attrs)
    end

    test "update_posts/2 with valid data updates the posts" do
      posts = posts_fixture()
      assert {:ok, %Posts{} = posts} = Blog.update_posts(posts, @update_attrs)
      assert posts.body == %{}
      assert posts.cover_image == "some updated cover_image"
      assert posts.logo == "some updated logo"
      assert posts.post_type == "some updated post_type"
      assert posts.snippet == "some updated snippet"
      assert posts.subtitle == "some updated subtitle"
      assert posts.tag_ids == []
      assert posts.title == "some updated title"
      assert posts.visibility == "some updated visibility"
    end

    test "update_posts/2 with invalid data returns error changeset" do
      posts = posts_fixture()
      assert {:error, %Ecto.Changeset{}} = Blog.update_posts(posts, @invalid_attrs)
      assert posts == Blog.get_posts!(posts.id)
    end

    test "delete_posts/1 deletes the posts" do
      posts = posts_fixture()
      assert {:ok, %Posts{}} = Blog.delete_posts(posts)
      assert_raise Ecto.NoResultsError, fn -> Blog.get_posts!(posts.id) end
    end

    test "change_posts/1 returns a posts changeset" do
      posts = posts_fixture()
      assert %Ecto.Changeset{} = Blog.change_posts(posts)
    end
  end
end
