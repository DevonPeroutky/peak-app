import {store} from "./store";
import {AppState} from "./index";
import {Peaker} from "../types";
import {DisplayPeaker} from "./slices/userAccountsSlice";

export function currentUserInRedux(): Peaker {
  return (store.getState() as AppState).currentUser
}

export function getUserAccount(userId: string): DisplayPeaker {
  const accounts: DisplayPeaker[] = (store.getState() as AppState).userAccounts
  return accounts.find(account => account.id === userId)
}
