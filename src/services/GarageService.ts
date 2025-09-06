import { Links, makeApiUrl } from "../Links";
import WinnersService from "./WinnersService";
import { clearBuffer } from "../store/CarPropsInputBufferSlice";
import store, { GarageSlice } from "../store/store";
import {
  carModelsByBrand,
  hexColorRegex,
  hexColors,
} from "../types/GlobalConst";
import fetchHelper from "../utils/fetchHelper";
import randomItem from "../utils/randomItem";

import type { ICar } from "../types/ApiTypes";

export default class GarageService {
  static MAX_CAR_NAME_LENGTH = 80;

  static MIN_CAR_NAME_LENGTH = 2;

  static async getGarage(): Promise<ICar[]> {
    const cars: ICar[] = await fetchHelper<ICar[]>({
      url: makeApiUrl(Links.ENDP_GARAGE),
      method: "GET",
      isJsonBody: false,
    });

    store.dispatch(GarageSlice.actions.setItems(cars));

    return cars;
  }

  static async getCar(id: number): Promise<ICar> {
    if (id < 0) throw new Error("Invalid car id");

    let car: ICar;
    try {
      car = await fetchHelper<ICar>({
        url: makeApiUrl(Links.ENDP_GARAGE, id.toString()),
        method: "GET",
        isJsonBody: false,
      });
    } catch (e) {
      throw new Error("Invalid car id");
    }

    return car;
  }

  static async addCar(
    name: string,
    color: string,
    noStateChange = false,
  ): Promise<ICar> {
    if (
      !name ||
      name.length < this.MIN_CAR_NAME_LENGTH ||
      name.length > this.MAX_CAR_NAME_LENGTH ||
      !hexColorRegex.test(color)
    ) {
      throw new Error("Invalid arguments");
    }

    const carAdded = await fetchHelper<ICar>({
      url: makeApiUrl(Links.ENDP_GARAGE),
      method: "POST",
      isJsonBody: true,
      body: { name, color },
    });

    if (!noStateChange) {
      store.dispatch(GarageSlice.actions.addItem(carAdded));
    }
    return carAdded;
  }

  static async updateCar(): Promise<ICar> {
    const state = store.getState().carPropsInputBufferSlice;
    if (
      !state?.name ||
      state.name.length < this.MIN_CAR_NAME_LENGTH ||
      state.name.length > this.MAX_CAR_NAME_LENGTH ||
      state.id < 0 ||
      !hexColorRegex.test(state.color)
    ) {
      throw new Error("No car props found or invalid arguments");
    }

    const updatedCar = await fetchHelper<ICar>({
      url: makeApiUrl(Links.ENDP_GARAGE, state.id.toString()),
      method: "PUT",
      isJsonBody: true,
      body: {
        name: state.name,
        color: state.color,
      },
    });

    store.dispatch(GarageSlice.actions.updateItem(updatedCar));
    store.dispatch(clearBuffer());
    return updatedCar;
  }

  static deleteCar(id: number): boolean {
    if (id < 0) return false;

    fetchHelper({
      url: makeApiUrl(Links.ENDP_GARAGE, id.toString()),
      method: "DELETE",
      isJsonBody: false,
    })
      .then(() => WinnersService.removeWinner(id))
      .catch((error: string) => {
        if (JSON.parse(error).status === 404) {
          return false;
        }
        throw new Error(error);
      });

    store.dispatch(GarageSlice.actions.removeItem(id));
    return true;
  }

  static async addCarFromStore(): Promise<ICar> {
    const state = store.getState().carPropsInputBufferSlice;
    if (!state) throw new Error("No car props found");
    return this.addCar(state.name, state.color);
  }

  static async generateCars(carsNumber: number): Promise<void> {
    const carPromises: Promise<ICar>[] = [];
    for (let i = 0; i < carsNumber; i += 1) {
      const brand = randomItem(Object.keys(carModelsByBrand)) ?? "";
      carPromises.push(
        this.addCar(
          `${brand} ${randomItem(carModelsByBrand[brand])}`,
          randomItem(hexColors) ?? "",
          true,
        ),
      );
    }

    const newCars = await Promise.all(carPromises);
    store.dispatch(GarageSlice.actions.addItemsBulk(newCars));
  }
}
