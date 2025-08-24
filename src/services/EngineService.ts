import { Links, makeApiUrl } from "../Links";
import { EngineStatus } from "../types/ApiTypes";
import fetchHelper from "../utils/fetchHelper";

import type { ICarRaceStats } from "../types/ApiTypes";

export default class EngineService {
  // Even though this method returns the estimated time of the race,
  // it is only used for the correct work of animations.
  // The winner is decided by calculations based on
  // request pending time
  static async startEngine(id: number): Promise<number> {
    if (id < 0) throw new Error("Invalid car id");

    try {
      const res: ICarRaceStats = await fetchHelper({
        url: makeApiUrl(Links.ENDP_ENGINE),
        method: "PATCH",
        isJsonBody: false,
        query: { id, status: EngineStatus.STARTED },
      });

      return res.distance / res.velocity;
    } catch (e) {
      throw new Error("Invalid car id");
    }
  }

  static stopEngine(id: number): void {
    if (id < 0) throw new Error("Invalid car id");

    fetchHelper({
      url: makeApiUrl(Links.ENDP_ENGINE),
      method: "PATCH",
      isJsonBody: false,
      query: { id, status: EngineStatus.STOPPED },
    }).catch(() => {
      throw new Error("Invalid car id");
    });
  }

  static async drive(id: number): Promise<boolean> {
    if (id < 0) throw new Error("Invalid car id");

    try {
      const res: { success: boolean } = await fetchHelper({
        url: makeApiUrl(Links.ENDP_ENGINE),
        method: "PATCH",
        isJsonBody: false,
        query: { id, status: EngineStatus.DRIVE },
      });

      return res.success;
    } catch (e) {
      if (typeof e === "object" && e !== null && "status" in e) {
        if (e.status === 400 || e.status === 404) {
          throw new Error("Invalid car id");
        }

        if (e.status === 429) {
          throw new Error("Too many requests");
        }

        if (e.status === 500) {
          return false;
        }
      }
    }

    return false;
  }
}
