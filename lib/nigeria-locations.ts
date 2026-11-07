export const NIGERIA_COUNTRY = "Nigeria";

export interface NigeriaState {
  name: string;
  capital: string;
  cities: string[];
}

// All 36 states plus the Federal Capital Territory (FCT), Abuja.
// Each state lists its capital first, followed by other major cities.
export const NIGERIA_STATES: NigeriaState[] = [
  {
    name: "Abia",
    capital: "Umuahia",
    cities: ["Umuahia", "Aba", "Ohafia", "Arochukwu", "Aba North", "Isiala Ngwa"],
  },
  {
    name: "Adamawa",
    capital: "Yola",
    cities: ["Yola", "Mubi", "Jimeta", "Numan", "Ganye", "Michika"],
  },
  {
    name: "Akwa Ibom",
    capital: "Uyo",
    cities: ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Ibeno"],
  },
  {
    name: "Anambra",
    capital: "Awka",
    cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Agulu", "Ojoto"],
  },
  {
    name: "Bauchi",
    capital: "Bauchi",
    cities: ["Bauchi", "Azare", "Misau", "Jama'are", "Darazo", "Ningi"],
  },
  {
    name: "Bayelsa",
    capital: "Yenagoa",
    cities: ["Yenagoa", "Brass", "Nembe", "Ogbia", "Sagbama"],
  },
  {
    name: "Benue",
    capital: "Makurdi",
    cities: ["Makurdi", "Gboko", "Otukpo", "Vandeikya", "Katsina-Ala", "Adikpo"],
  },
  {
    name: "Borno",
    capital: "Maiduguri",
    cities: ["Maiduguri", "Biu", "Dikwa", "Monguno", "Gwoza", "Bama"],
  },
  {
    name: "Cross River",
    capital: "Calabar",
    cities: ["Calabar", "Ikom", "Ogoja", "Obudu", "Ugep", "Akamkpa"],
  },
  {
    name: "Delta",
    capital: "Asaba",
    cities: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor", "Udu", "Effurun"],
  },
  {
    name: "Ebonyi",
    capital: "Abakaliki",
    cities: ["Abakaliki", "Afikpo", "Onueke", "Ishieke", "Ezzamgbo", "Amasiri"],
  },
  {
    name: "Edo",
    capital: "Benin City",
    cities: ["Benin City", "Uromi", "Auchi", "Ekpoma", "Ubiaja", "Irrua"],
  },
  {
    name: "Ekiti",
    capital: "Ado Ekiti",
    cities: ["Ado Ekiti", "Ikere Ekiti", "Oye Ekiti", "Efon Alaye", "Ise Ekiti", "Ilawe Ekiti"],
  },
  {
    name: "Enugu",
    capital: "Enugu",
    cities: ["Enugu", "Nsukka", "Awgu", "Ezeagu", "Oji River", "Udi"],
  },
  {
    name: "FCT",
    capital: "Abuja",
    cities: ["Abuja", "Gwagwalada", "Kuje", "Kwali", "Bwari", "Abaji"],
  },
  {
    name: "Gombe",
    capital: "Gombe",
    cities: ["Gombe", "Kumo", "Billiri", "Kaltungo", "Dukku", "Deba"],
  },
  {
    name: "Imo",
    capital: "Owerri",
    cities: ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta", "Nkwerre"],
  },
  {
    name: "Jigawa",
    capital: "Dutse",
    cities: ["Dutse", "Hadejia", "Gumel", "Kazaure", "Ringim", "Birnin Kudu"],
  },
  {
    name: "Kaduna",
    capital: "Kaduna",
    cities: ["Kaduna", "Zaria", "Kafanchan", "Saminaka", "Birnin Gwari", "Kachia"],
  },
  {
    name: "Kano",
    capital: "Kano",
    cities: ["Kano", "Wudil", "Rano", "Kura", "Gwarzo", "Dambatta"],
  },
  {
    name: "Katsina",
    capital: "Katsina",
    cities: ["Katsina", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma", "Kankia"],
  },
  {
    name: "Kebbi",
    capital: "Birnin Kebbi",
    cities: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega", "Kamba"],
  },
  {
    name: "Kogi",
    capital: "Lokoja",
    cities: ["Lokoja", "Okene", "Idah", "Kabba", "Ankpa", "Ajaokuta"],
  },
  {
    name: "Kwara",
    capital: "Ilorin",
    cities: ["Ilorin", "Offa", "Lafiagi", "Share", "Ijagbo", "Bode Saadu"],
  },
  {
    name: "Lagos",
    capital: "Ikeja",
    cities: ["Ikeja", "Lagos Island", "Lekki", "Victoria Island", "Surulere", "Yaba", "Ikorodu", "Epe", "Badagry", "Ajah"],
  },
  {
    name: "Nasarawa",
    capital: "Lafia",
    cities: ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Karu", "Toto"],
  },
  {
    name: "Niger",
    capital: "Minna",
    cities: ["Minna", "Bida", "Kontagora", "Suleja", "Agaie", "New Bussa"],
  },
  {
    name: "Ogun",
    capital: "Abeokuta",
    cities: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota", "Ilaro", "Ijebu Igbo"],
  },
  {
    name: "Ondo",
    capital: "Akure",
    cities: ["Akure", "Ondo City", "Owo", "Ore", "Ikare", "Okitipupa"],
  },
  {
    name: "Osun",
    capital: "Osogbo",
    cities: ["Osogbo", "Ilesa", "Iwo", "Ede", "Ife", "Ejigbo"],
  },
  {
    name: "Oyo",
    capital: "Ibadan",
    cities: ["Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Saki", "Okeho"],
  },
  {
    name: "Plateau",
    capital: "Jos",
    cities: ["Jos", "Bukuru", "Vom", "Pankshin", "Shendam", "Langtang"],
  },
  {
    name: "Rivers",
    capital: "Port Harcourt",
    cities: ["Port Harcourt", "Obio-Akpor", "Bonny", "Okrika", "Eleme", "Oyigbo", "Degema"],
  },
  {
    name: "Sokoto",
    capital: "Sokoto",
    cities: ["Sokoto", "Gwadabawa", "Wurno", "Tambuwal", "Binji", "Isa"],
  },
  {
    name: "Taraba",
    capital: "Jalingo",
    cities: ["Jalingo", "Wukari", "Bali", "Takum", "Mutum Biyu", "Serti"],
  },
  {
    name: "Yobe",
    capital: "Damaturu",
    cities: ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam", "Buni Yadi"],
  },
  {
    name: "Zamfara",
    capital: "Gusau",
    cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Bungudu", "Tsafe"],
  },
];

/** Returns the state capital for a given state name, or "" if not found. */
export function getStateCapital(stateName: string): string {
  const state = NIGERIA_STATES.find((s) => s.name === stateName);
  return state ? state.capital : "";
}

/**
 * Returns the list of cities for a given state (capital first), or [] if not found.
 * Extra cities beyond the built-in list can be merged in via `extra` (e.g. an
 * existing hub value not present in our list).
 */
export function getStateCities(stateName: string, extra?: string[]): string[] {
  const state = NIGERIA_STATES.find((s) => s.name === stateName);
  const base = state ? state.cities : [];
  if (!extra || extra.length === 0) return base;
  const merged = new Set<string>(base);
  extra.forEach((c) => c && merged.add(c));
  return Array.from(merged);
}