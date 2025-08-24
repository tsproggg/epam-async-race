import { Links, makeApiUrl } from "../Links";
import store, { WinnersSlice } from "../store/store";
import fetchHelper from "../utils/fetchHelper";

import type { IWinner } from "../types/ApiTypes";

export default class WinnersService {
  static async getWinners(): Promise<IWinner[]> {
    const winners: IWinner[] = await fetchHelper({
      url: makeApiUrl(Links.ENDP_WINNERS),
      method: "GET",
      isJsonBody: false,
    });

    store.dispatch(WinnersSlice.actions.setItems(winners));

    return winners;
  }
}
