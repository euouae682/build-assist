export type IDs = {
  [key: string]: number | {
    min: number,
    max: number,
    raw: number
  }
}

export type WynnItem = {
  rarity: string,
  powderSlots?: number,
  type: string,
  attackSpeed: string,
  majorIds?: {
    name: string,
    description: string
  },
  base?: {
    [key: string]: {
      min: number,
      max: number
    } | number,
  },
  requirements: {
    level: number
    [key: string]: number
  }
  identifications: IDs,
  [key: string]: unknown
};

export type ItemList = {
  [key: string]: WynnItem
}

export type Damage = {
  baseAtkMult: number,
  damages: {
    neutral: {min: number, max: number},
    earth: {min: number, max: number},
    thunder: {min: number, max: number},
    water: {min: number, max: number},
    fire: {min: number, max: number},
    air: {min: number, max: number}
  }
}

export type Indices = {
  general: GeneralIndex,
  baseDps?: Index,
  spell: Index,
  melee: Index,
  mana: Index,
  skillPoints: Index
  health: Index,
  life: Index,
  other: Index,
  minor: Index
}

type GeneralIndex = {
  name: string,
  level: number,
  rarity: string,
  details: string[]
}

type Index = {
  value: number,
  details: string[]
}
