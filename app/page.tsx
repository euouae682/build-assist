'use client';

// TODO: add filters for combat level/skill point reqs
// TODO: add health index
// TODO: add hp sustain index (if includes postiive health regen %, list index as just above 0)
// TODO: add walkspeed index
// TODO: add other index/section
// TODO: add xp/lb index
// TODO: add warnings for percent health regen
// TODO: add warnings for rollable hp
// TODO: add `how are indices calculated`?
// TODO: add credits/resources
// TODO: add skill point index
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
import { getIndices } from "./itemFuncs";

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
  requirements: {
    level: number
    [key: string]: number
  }
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

export type Indices = {
  level: number,
  name: string,
  rarity: string,
  spell: [number],
  melee: [number, string],
  poison: [number, string],
  mana: [number, string],
}

export default function Home() {
  // Form state variables - general
  const [weaponType, setWeaponType] = useState('');
  const [weapon, setWeapon] = useState('');
  const [powderSlots, setPowderSlots] = useState(0);
  const [powdering, setPowdering] = useState('');
  const [gearType, setGearType] = useState('');

  // Form state variables - CPS/Steals
  const [useSteals, setUseSteals] = useState(true);
  const [cps, setCps] = useState(0);
  const [spellCycle, setSpellCycle] = useState('');
  const [costs, setCosts] = useState<[number, number, number, number]>([35, 20, 35, 30]);

  // Form state variables - Sort by
  const [sortBy, setSortBy] = useState('spell');

  // Data state variables
  const [itemsList, setItemsList] = useState<ItemList | null>(null);
  const [weaponsList, setWeaponsList] = useState<string[] | null>(null);
  const [gearList, setGearList] = useState<string[] | null>(null);
  const [indices, setIndices] = useState<Indices[] | null>(null);

  // Aesthetic state variables
  const [showInfo, setShowInfo] = useState(false);
  const [showCalcs, setShowCalcs] = useState(false);

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
        .map((item) => item[0])
        .sort());
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

  const calculateGearBoosts = (): void => {
    let indicesList: Indices[] = [];
    if (itemsList != null && gearList != null) {
      gearList.map((gearName) => {
        indicesList.push(getIndices(itemsList[weapon], powdering, gearName, itemsList[gearName], useSteals, cps, spellCycle, costs));
      })
    }

    if (sortBy === "spell" || sortBy === "melee" || sortBy === "poison" || sortBy === "mana") {
      sortList(indicesList, sortBy);
    }
    setIndices(indicesList);
  }

  const sortList = (list: Indices[], key: "spell" | "melee" | "poison" | "mana"): Indices[] => {
    if (list !== null) {
      return list.sort((index1, index2) => index2[key][0] - index1[key][0]);
    }
    return [];
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
    filterGear(e.target.value);
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

  const onCostsChange = (e: React.ChangeEvent<HTMLInputElement>, spell: number): void => {
    let newCosts: [number, number, number, number] = [...costs];
    newCosts[spell] = e.target.valueAsNumber;
    setCosts(newCosts);
  }

  const onSortByChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  }

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (weapon === '') {
      alert("Warning: Weapon not selected!");
    }
    else if (gearType === '') {
      alert("Warning: Gear type not selected!");
    }
    else if (cps === 0) {
      alert("Warning: CPS must be a positive number!");
    }
    else if (spellCycle === '') {
      alert("Warning: Spell cycle not entered!")
    }
    else if (sortBy === '') {
      alert("Warning: Index to sort by not selected!");
    }
    else {
      calculateGearBoosts();
    }
  }

  return (
    <main className="m-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold leading-12">Wynncraft Build Assist</h1>
        <h2 className="text-2xl">a goofy web app by euouae</h2>
        <p className="text-slate-400 mt-2 hover:text-slate-600 cursor-pointer transition w-44" onClick={() => setShowInfo(!showInfo)}>What am I looking at?</p>
        {
          showInfo ? <p>
            placeholder
          </p> : <></>
        }
        <p className="text-slate-400 hover:text-slate-600 cursor-pointer transition w-56" onClick={() => setShowCalcs(!showCalcs)}>How are indices calculated?</p>
        {
          showCalcs ? <p>
            placeholder
          </p> : <></>
        }
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
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onGearChange} defaultValue="default">
            <option disabled value="default"> -- select an option -- </option>
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
          <label htmlFor="cps">Spell Cycle (i.e. 1334): </label>
          <input type="text" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition w-32" onChange={onSpellCycleChange} pattern={"[1-4]+"} />
        </div>

        <div>
          <label htmlFor="cost1">1st Spell Cost: {costs[0]} </label>
          <input className="w-48" type="range" id="cost1" name="cost1" min="1" max="100" value={costs[0]} onChange={(e) => onCostsChange(e, 0)} /><br/>
          <label htmlFor="cost2">2nd Spell Cost: {costs[1]} </label>
          <input className="w-48" type="range" id="cost2" name="cost2" min="1" max="100" value={costs[1]} onChange={(e) => onCostsChange(e, 1)} /><br/>
          <label htmlFor="cost3">3rd Spell Cost: {costs[2]} </label>
          <input className="w-48" type="range" id="cost3" name="cost3" min="1" max="100" value={costs[2]} onChange={(e) => onCostsChange(e, 2)} /><br/>
          <label htmlFor="cost4">4th Spell Cost: {costs[3]} </label>
          <input className="w-48" type="range" id="cost4" name="cost4" min="1" max="100" value={costs[3]} onChange={(e) => onCostsChange(e, 3)} /><br/>
        </div>

        <div>
          <label htmlFor="playstyle">Sort By: </label>
          <select id="sortby" name="sortby" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onSortByChange}>
            <option value="spell">Spell Damage</option>
            <option value="melee">Melee Damage</option>
            <option value="poison">Poison</option>
            <option value="mana">Mana Sustain</option>
          </select> 
        </div>
        
        <input type="submit" value="Calculate Gear Indices" className="bg-slate-700 rounded-md p-1 hover:bg-slate-500 text-white transition cursor-pointer" />
      </form>

      <div>
        <h2 className="text-xl font-bold">Results</h2>
        <div className="border border-slate-600 w-[800px]">
          <div className="m-2 flex">
            <p className="w-64 font-bold">Name</p>
            <p className="w-32 font-bold">Spell</p>
            <p className="w-32 font-bold">Melee</p>
            <p className="w-32 font-bold">Poison</p>
            <p className="w-32 font-bold">Mana Sustain</p>
          </div>
          {
            indices ? indices.map((index) => {
              return <Item 
                key={index.name}
                index={index} />
            }) : <></>
          }
        </div>
      </div>
    </main>
  );
}
