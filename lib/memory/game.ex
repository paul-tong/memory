defmodule Memory.Game do

  # create a new game
  def new do
    status = List.duplicate("hide", 16)
    values = List.duplicate(["A", "B", "C", "D", "E", "F", "G", "H"], 2)
             |> List.flatten() |> Enum.shuffle()
    %{
      isWin: false,
      clickNumber: 0,
      preCard: -1, 
      curCard: -1,
      isPaused: false, 
      cardsStatus: status,
      cardsValue: values,
    }
  end

  # view that sent to client side
  def client_view(game) do
    %{
      isWin: game.isWin,
      isPaused: game.isPaused,
      clickNumber: game.clickNumber,
      cardsStatus: game.cardsStatus,
      cardsValue: game.cardsValue,
    }
  end

  # handle the click event
  def handleClick(game, n) do
    if !game.isPaused && Enum.at(game.cardsStatus, n) == "hide" do
      number = game.clickNumber + 1
      status = List.replace_at(game.cardsStatus, n, "open")
      Map.put(game, :clickNumber, number)
      |> Map.put(:cardsStatus, status)
      |> checkWhetherFirst(n)
    else 
      game
    end
  end

  # check whether it's the first opened broad
  def checkWhetherFirst(game, n) do
    if game.preCard == -1 do
      Map.put(game, :preCard, n)
    else
      Map.put(game, :isPaused, true)
      |> Map.put(:curCard, n)
    end
  end 

  # unpause the game
  def unpause(game) do
    :timer.sleep(1000)
    Map.put(game, :isPaused, false)
    |> checkWhetherRemove
  end

  # check whether needs to remove these two cards or hide them
  def checkWhetherRemove(game) do
    status = game.cardsStatus
    if Enum.at(game.cardsValue, game.curCard) == Enum.at(game.cardsValue, game.preCard) do
      status = List.replace_at(game.cardsStatus, game.curCard, "removed")
               |> List.replace_at(game.preCard, "removed")
    else
      status = List.replace_at(game.cardsStatus, game.curCard, "hide")
               |> List.replace_at(game.preCard, "hide")
    end
    Map.put(game, :cardsStatus, status)
    |> Map.put(:preCard, -1)
    |> Map.put(:curCard, -1)
    |> checkWin()
  end

# check whether all cards have been removed
  def checkWin(game) do
    if Enum.all?(game.cardsStatus, fn(x) -> x == "removed" end) do
      Map.put(game, :isWin, true)
    else
      game
    end
  end

end
