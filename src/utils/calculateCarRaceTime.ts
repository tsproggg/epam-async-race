import EngineService from "../services/EngineService";

import type { IGlobalRaceCarStats } from "../types/Interfaces";

export default async function calculateCarRaceTime(
  id: number,
  abortSignal: AbortSignal,
): Promise<IGlobalRaceCarStats> {
  const startTimeMs = Date.now();

  const success = await EngineService.drive(id, abortSignal);

  const raceTime = Date.now() - startTimeMs;

  return { id, hasFinished: success, time: raceTime };
}
