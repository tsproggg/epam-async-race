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

  static async getWinner(id: number): Promise<IWinner | null> {
    if (id < 0) return null;

    return fetchHelper<IWinner>({
      url: makeApiUrl(Links.ENDP_WINNERS, id.toString()),
      method: "GET",
      isJsonBody: false,
    }).catch(() => null);
  }

  static async createWinner(id: number, time: number): Promise<IWinner | null> {
    if (id < 0 || time < 0) return null;

    const winner: IWinner = await fetchHelper<IWinner>({
      url: makeApiUrl(Links.ENDP_WINNERS),
      method: "POST",
      isJsonBody: true,
      body: { id, time, wins: 1 },
    });

    store.dispatch(WinnersSlice.actions.addItem(winner));

    return winner;
  }

  static async updateWinner(data: IWinner): Promise<IWinner | null> {
    if (data.id < 0 || data.time < 0 || data.wins < 0) return null;

    const winnerUpdated: IWinner = await fetchHelper<IWinner>({
      url: makeApiUrl(Links.ENDP_WINNERS, data.id.toString()),
      method: "PUT",
      isJsonBody: true,
      body: { ...data },
    });

    store.dispatch(WinnersSlice.actions.updateItem(winnerUpdated));

    return winnerUpdated;
  }

  static removeWinner(id: number): boolean {
    if (id < 0) return false;

    fetchHelper({
      url: makeApiUrl(Links.ENDP_WINNERS, id.toString()),
      method: "DELETE",
      isJsonBody: false,
    })
      .then(() => {
        store.dispatch(WinnersSlice.actions.removeItem(id));
      })
      .catch((error: string) => {
        if (JSON.parse(error).status === 404) {
          return false;
        }
        throw new Error(error);
      });

    return true;
  }

  static async addWin(id: number, time: number): Promise<IWinner | null> {
    if (id < 0 || time < 0) return null;

    const winner = await this.getWinner(id);
    if (winner === null) {
      return this.createWinner(id, time);
    }

    return this.updateWinner({ id, time, wins: winner.wins + 1 });
  }
}
