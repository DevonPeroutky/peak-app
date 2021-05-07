defmodule MyAppWeb.JournalChannel do
  use MyAppWeb, :channel
  alias MyAppWeb.BookController

  require Logger

  ## TODO, ensure a user can only join their own channel.
  def join("journal:" <> user_id, _params, socket) do
    IO.puts "#{user_id} is JOINING!"

    # Stores the journal in the socket's state via a call to assign.
    socket = assign(socket, :journal, user_id)
#    %{id: id} = socket.assigns[:current_user]

    send(self, {:after_join, user_id})

    # Respond to the client
    response  = %{journal: user_id}
    {:ok, response, socket}
  end

  ## TODO, turn this into a struct that the REST endpoint shares.
  def handle_in("submit_web_note", %{"user_id" => user_id, "note" => note_params, "entry_date" => entry_date}, socket) do
    IO.puts "#{user_id} created a WebNote! We are doing this via REST now..."
    IO.inspect note_params

#    res = BookController.upsert_note(user_id, entry_date, note_params) |> IO.inspect
#    case res do
#
##      {:ok, %{nodes_appended: nodes_appended, book: note}} ->
#      {:ok, %{book: note, tags: tags}} ->
#        IO.puts "BOMBS AWAY"
#        note_map = Map.from_struct(note) |> Map.put("note_id", note.id) |> Map.delete(:__meta__) |> Map.delete(:user)
#        IO.inspect note_map
#        broadcast! socket, "web_note_created", %{note: note_map, tags: tags}
#        {:reply, {:ok, "success"}, socket}
#      {:err, _reason} ->
#        Logger.error "Failed to upsert_note for #{user_id} - #{entry_date}"
#        {:reply, {:error, %{error: "Error updating Journal"}}, socket}
#    end


    #    case Challenge.update(socket.assigns.challenge, codeResponse) do
    #      {:ok, challenge} ->
    #        broadcast! socket, "response:updated", %{challenge: challenge}
    #        {:noreply, socket}
    #      {:error, changeset} ->
    #        {:reply, {:error, %{error: "Error updating challenge"}}, socket}
    #    end

  end

  def handle_in("test", %{"user_id" => user_id}, socket) do
    MyAppWeb.Endpoint.broadcast("journal:#{user_id}", "test:complete", %{swag: "engaged"})
    Logger.info "Received the broadcast!!!"
    {:noreply, socket}
  end

  def handle_info({:after_join, user_id}, socket) do
    # store user in our Presence store
    # broadcast out the new list of users to subscribers
    # send the list of existing users to the newly joined client

#    MyAppWeb.JournalPresence.track_user_join(socket, socket.assigns.current_user)
#    broadcast! socket, "bs_response", %{user_id: user_id}
    {:noreply, socket}
  end
end