defmodule MyAppWeb.JournalPresence do
  use Phoenix.Presence, otp_app: :my_app, pubsub_server: MyApp.PubSub


  # challenge_presence.ex
  def track_user_join(socket, user) do
    JournalPresence.track(socket, user.id, %{
      user_id: user.id
    })
  end
end