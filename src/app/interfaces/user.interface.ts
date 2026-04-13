import { PlayerProfileInterface } from "./play-profile.interface";

export interface UserInterface extends PlayerProfileInterface {
  email: string;
  password: string;
}