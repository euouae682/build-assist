'use client';

// TODO: add `how are indices calculated`?
// TODO: add credits/resources
// TODO: add limitations section (This app is by NO MEANS a concrete representation of what items are best for your build,
//       and should NOT be used as the sole source of decisionmaking for builds. It only serves to give a GENERAL idea of 
//       what gear would be effective for a weapon).
// This app does not consider:
//     - Spell Conversions
//     - Major IDs
//     - Abilities/the Ability Tree
//     - Skill point bonuses
//     - Only looks at specific items in isolation (potential issue for Spell Cost, HPR, or cancelstack)
//     - Other important aspects of builds, i.e. Walkspeed or Defensive stats

import React, { useState, useEffect } from "react";
import Item from "./Item";
import { getIndices, testIndices } from "./itemFuncs";

type GearBoost = {
  name: string,
  rarity: string,
  spell: number,
  melee: number,
  poison: number,
  mana: number,
  life: number
}

export type IDs = {
  [key: string]: number | {
    min: number,
    max: number,
    raw: number
  }
}

export type Item = {
  tier: string,
  powderSlots: number,
  type: string,
  attackSpeed: string,
  base?: {
    [key: string]: {
      min: number,
      max: number
    },
  },
  identifications: IDs,
  [key: string]: unknown
};

export type ItemList = {
  [key: string]: Item
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

export default function Home() {
  const [weaponType, setWeaponType] = useState('');
  const [weapon, setWeapon] = useState('');
  const [powderSlots, setPowderSlots] = useState(0);
  const [powdering, setPowdering] = useState('');
  const [gearType, setGearType] = useState('helmet');

  const [useSteals, setUseSteals] = useState(true);
  const [cps, setCps] = useState(6);
  const [spellCycle, setSpellCycle] = useState('');
  const [sortBy, setSortBy] = useState('spell');

  const [itemsList, setItemsList] = useState<ItemList | null>(null);
  const [weaponsList, setWeaponsList] = useState<string[] | null>(null);
  const [gearList, setGearList] = useState<string[] | null>(null);

  useEffect(() => {
    getItems();
  }, [])

  async function getItems() {
    const response = await fetch('./data.json');
    const json: ItemList = await response.json();
    setItemsList(json);
  }

  const filterWeapons = (type: string): void => {
    if (itemsList !== null) {
      setWeaponsList(Object.entries(itemsList)
        .filter((item) => 'type' in item[1] && item[1]['type'] === type)
        .map((item) => item[0]));
    }
  }

  const filterGear = (type: string): void => {
    if (itemsList !== null) {
      setGearList(Object.entries(itemsList)
        .filter((item) => ('type' in item[1] && item[1]['type'] === type) || ('accessoryType' in item[1] && item[1]['accessoryType'] === type))
        .map((item) => item[0]));
    }
  }

  const getPowderSlots = (weapon: string): void => {
    console.log(weapon);
    if (itemsList !== null) {
      if ('powderSlots' in itemsList[weapon]) {
        setPowderSlots(itemsList[weapon]['powderSlots'])
      }
      else {
        setPowderSlots(0);
      }
    }
    else {
      setPowderSlots(0);
    }
  }

  const calculateGearBoosts = (): GearBoost[] => {
    filterGear(gearType);

    // Calculate damage from Item
    if (itemsList != null) {
      testIndices(itemsList[weapon], powdering, itemsList['Conflagrate'], useSteals, cps, spellCycle);
    }

    sortList(sortBy);
    return [];
  }

  const sortList = (key: string): void => {

  }

  const onClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setWeaponType(e.target.value);
    filterWeapons(e.target.value);
  }

  const onWeaponsChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setWeapon(e.target.value);
    getPowderSlots(e.target.value);
    setPowdering('');
  }

  const onPowderingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPowdering(e.target.value);
  }

  const onGearChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setGearType(e.target.value);
  }

  const onPlaystyleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.value === "regen") {
      setUseSteals(false);
    }
    else {
      setUseSteals(true);
    }
  }

  const onCPSChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCps(e.target.valueAsNumber);
  }

  const onSpellCycleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSpellCycle(e.target.value);
  }

  const onSortByChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  }

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    filterGear(gearType);


    
    calculateGearBoosts();
  }

  return (
    <main className="m-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold leading-12">Wynncraft Build Assist</h1>
        <h2 className="text-2xl">a goofy web app by euouae</h2>
      </div>
      <form className="flex flex-col gap-2 w-96" onSubmit={onFormSubmit}>
        <div>
          <h2 className="text-xl font-bold">Class/Weapons</h2>
          <label htmlFor="cla">Class: </label>
          <select id="cla" name="cla" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" defaultValue="default" onChange={onClassChange}>
            <option disabled value="default"> -- select an option -- </option>
            <option value="bow">Archer/Hunter</option>
            <option value="spear">Warrior/Knight</option>
            <option value="relik">Shaman/Skyseer</option>
            <option value="wand">Mage/Dark Wizard</option>
            <option value="dagger">Assassin/Ninja</option>
          </select>
        </div>

        <div className={weaponType === "" ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="wpn">Weapon: </label>
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onWeaponsChange}>
            { weaponsList != null ? weaponsList.map((itemName) => {
              return <option key={itemName} value={itemName}>
                { itemName }
              </option>
            }) : <></> }
          </select>
        </div>

        <div className={powderSlots === 0 ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="pwd">Powdering: </label>
          <input type="text" id="pwd" name="pwd" className="bg-slate-200 rounded-md p-1 transition" pattern={"([etwfa][1-6]){" + powderSlots + "}"} placeholder={powderSlots + " slots"} value={powdering} onChange={onPowderingChange} />
        </div>

        <div>
          <label htmlFor="wpn">Gear: </label>
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onGearChange}>
            <option value="helmet">Helmet</option>
            <option value="chestplate">Chestplate</option>
            <option value="leggings">Leggings</option>
            <option value="boots">Boots</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
            <option value="necklace">Necklace</option>
          </select>
        </div> 

        <div>
          <label htmlFor="playstyle">Playstyle: </label>
          <select id="playstyle" name="playstyle" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onPlaystyleChange}>
            <option value="steals">Hybrid or Melee (MR/MS)</option>
            <option value="regen">Spellspam (Only MR)</option>
          </select>
        </div>

        <div>
          <label htmlFor="cps">CPS: </label>
          <input type="number" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition w-16" onChange={onCPSChange} />
        </div>

        <div>
          <label htmlFor="cps">Spell Cycle: </label>
          <input type="text" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition w-32" onChange={onSpellCycleChange} pattern={"[1-4]+"} />
        </div>

        <div>
          <label htmlFor="playstyle">Sort By: </label>
          <select id="sortby" name="sortby" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onSortByChange}>
            <option value="spell">Spell Damage</option>
            <option value="melee">Melee Damage</option>
            <option value="poison">Poison</option>
            <option value="mana">Mana Sustain</option>
            <option value="life">Life Sustain</option>
          </select> 
        </div>
        
        <input type="submit" value="Calculate Gear Indices" className="bg-slate-700 rounded-md p-1 hover:bg-slate-500 text-white transition cursor-pointer" />
      </form>

      <div>
        <h2 className="text-xl font-bold">Results</h2>
        <div className="border border-slate-600">
          <div className="m-2 flex">
            <p className="w-64 font-bold">Name</p>
            <p className="w-32 font-bold">Spell</p>
            <p className="w-32 font-bold">Melee</p>
            <p className="w-32 font-bold">Poison</p>
            <p className="w-32 font-bold">Mana Sustain</p>
            <p className="w-32 font-bold">Life Sustain</p>
          </div>
          <Item level={99} name="Aphotic" rarity="legendary" spell={400} melee={-150} poison={0} mana={4} life={0} />
          <Item level={90} name="Sano's Care" rarity="unique" spell={0} melee={0} poison={0} mana={3} life={400} />
          <Item level={94} name="Nighthawk" rarity="fabled" spell={190} melee={-80} poison={0} mana={6} life={0} />
        </div>
      </div>
    </main>
  );
}
