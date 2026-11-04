export const NIGERIA_COUNTRY = "Nigeria";

export interface NigeriaState {
  name: string;
  capital: string;
}

// All 36 states plus the Federal Capital Territory (FCT), Abuja.
export const NIGERIA_STATES: NigeriaState[] = [
  { name: "Abia", capital: "Umuahia" },
  { name: "Adamawa", capital: "Yola" },
  { name: "Akwa Ibom", capital: "Uyo" },
  { name: "Anambra", capital: "Awka" },
  { name: "Bauchi", capital: "Bauchi" },
  { name: "Bayelsa", capital: "Yenagoa" },
  { name: "Benue", capital: "Makurdi" },
  { name: "Borno", capital: "Maiduguri" },
  { name: "Cross River", capital: "Calabar" },
  { name: "Delta", capital: "Asaba" },
  { name: "Ebonyi", capital: "Abakaliki" },
  { name: "Edo", capital: "Benin City" },
  { name: "Ekiti", capital: "Ado Ekiti" },
  { name: "Enugu", capital: "Enugu" },
  { name: "FCT", capital: "Abuja" },
  { name: "Gombe", capital: "Gombe" },
  { name: "Imo", capital: "Owerri" },
  { name: "Jigawa", capital: "Dutse" },
  { name: "Kaduna", capital: "Kaduna" },
  { name: "Kano", capital: "Kano" },
  { name: "Katsina", capital: "Katsina" },
  { name: "Kebbi", capital: "Birnin Kebbi" },
  { name: "Kogi", capital: "Lokoja" },
  { name: "Kwara", capital: "Ilorin" },
  { name: "Lagos", capital: "Ikeja" },
  { name: "Nasarawa", capital: "Lafia" },
  { name: "Niger", capital: "Minna" },
  { name: "Ogun", capital: "Abeokuta" },
  { name: "Ondo", capital: "Akure" },
  { name: "Osun", capital: "Osogbo" },
  { name: "Oyo", capital: "Ibadan" },
  { name: "Plateau", capital: "Jos" },
  { name: "Rivers", capital: "Port Harcourt" },
  { name: "Sokoto", capital: "Sokoto" },
  { name: "Taraba", capital: "Jalingo" },
  { name: "Yobe", capital: "Damaturu" },
  { name: "Zamfara", capital: "Gusau" },
];

/** Returns the state capital for a given state name, or "" if not found. */
export function getStateCapital(stateName: string): string {
  const state = NIGERIA_STATES.find((s) => s.name === stateName);
  return state ? state.capital : "";
}