'use client';

import React, { useState, useEffect } from "react";
import Item from "./Item";
import { getIndices } from "./itemFuncs";
import { SPELL_COSTS } from "./constants";

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
  skillPoints: [number, string]
  health: [number, string],
  life: [number, string],
  walkspeed: [number],
  healing: [number],
  major: [string]
}

export default function Home() {
  // Form state variables - general
  const [weaponType, setWeaponType] = useState('');
  const [weapon, setWeapon] = useState('');
  const [powderSlots, setPowderSlots] = useState(0);
  const [powdering, setPowdering] = useState('');
  const [gearType, setGearType] = useState('all');
  const [sp, setSp] = useState<[boolean, boolean, boolean, boolean, boolean]>([false, false, false, false, false]);
  const [levelReq, setLevelReq] = useState(105);

  // Form state variables - CPS/Steals
  const [useSteals, setUseSteals] = useState(true);
  const [cps, setCps] = useState(6);
  const [spellCycle, setSpellCycle] = useState('1234');
  const [int, setInt] = useState('60');
  const [costs, setCosts] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  // Form state variables - Sort by
  const [sortBy, setSortBy] = useState('spell');
  const [showAmt, setShowAmt] = useState(100);

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

  useEffect(() => {
    if (itemsList !== null) {
      setGearList(Object.entries(itemsList)
        .filter((item) => {
          if (gearType === 'all') {
            return ('type' in item[1] && (item[1]['type'] === 'helmet' 
              || item[1]['type'] === 'chestplate' 
              || item[1]['type'] === 'leggings' 
              || item[1]['type'] === 'boots')) || ('accessoryType' in item[1]);
          }
          else if (gearType === 'armor') {
            return 'type' in item[1] && (item[1]['type'] === 'helmet' 
              || item[1]['type'] === 'chestplate' 
              || item[1]['type'] === 'leggings' 
              || item[1]['type'] === 'boots');
          }
          else if (gearType === 'accessories') {
            return 'accessoryType' in item[1];
          }
          return ('type' in item[1] && item[1]['type'] === gearType) || ('accessoryType' in item[1] && item[1]['accessoryType'] === gearType);
        })
        .filter((item) => {
          if (item[1]['requirements']['level'] > levelReq) {
            return false;
          }
          if (sp[0] && 'strength' in item[1]['requirements']) {
            return false;
          }
          if (sp[1] && 'dexterity' in item[1]['requirements']) {
            return false;
          }
          if (sp[2] && 'intelligence' in item[1]['requirements']) {
            return false;
          }
          if (sp[3] && 'defence' in item[1]['requirements']) {
            return false;
          }
          if (sp[4] && 'agility' in item[1]['requirements']) {
            return false;
          }
          return true;
        })
        .map((item) => item[0]));
    }
  }, [itemsList, gearType, sp, levelReq])

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
        .sort()
      );
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
        indicesList.push(getIndices(itemsList[weapon], powdering, gearName, itemsList[gearName], useSteals, cps, spellCycle, costs, sp));
      })
    }

    if (sortBy === "spell" || sortBy === "melee" || sortBy === "poison" 
      || sortBy === "mana" || sortBy === "skillPoints" || sortBy === "health"
      || sortBy === "life" || sortBy === "walkspeed" || sortBy === "healing"
      || sortBy === "major") {
      sortList(indicesList, sortBy);
    }
    setIndices(indicesList.slice(0, showAmt));
  }

  const sortList = (list: Indices[], key: "spell" | "melee" | "poison" | "mana" | "skillPoints" | "health" | "life" | "walkspeed" | "healing" | "major"): Indices[] => {
    if (list !== null) {
      if (key === "major") {
        return list.sort((index1, index2) => index2["major"][0].localeCompare(index1["major"][0]))
      }
      return list.sort((index1, index2) => index2[key][0] - index1[key][0]);
    }
    return [];
  }

  const onClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setWeaponType(e.target.value);
    filterWeapons(e.target.value);
    setCosts(SPELL_COSTS[e.target.value][int]);
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
    // filterGear(e.target.value);
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

  const onSpChange = (e: React.ChangeEvent<HTMLInputElement>, toExclude: number): void => {
    let newSp: [boolean, boolean, boolean, boolean, boolean] = [...sp];
    newSp[toExclude] = e.target.checked;
    setSp(newSp);
  }

  const onLevelChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLevelReq(e.target.valueAsNumber);
  }

  const onIntChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setInt(e.target.value);
    const newCosts: [number, number, number, number] = SPELL_COSTS[weaponType][e.target.value];
    setCosts(newCosts);
  }

  const onSortByChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  }

  const onShowAmtChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setShowAmt(Number(e.target.value));
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
            This is a tool meant to assist builders by assigning “indices” to gear. These indices correspond to various metrics including damage stats, defensive stats, and mana while taking aspects such as weapon choice and spell cycle into account.The indices provided by this tool are usually a general estimate, and DO NOT precisely represent the actual offensive or defensive potential of the gear (for more info on this, see the “How are indices calculated?” section).<br/><br/>Therefore, this tool should NOT be used as:
            <ul>
              <li className="indent-8">- A damage/EHP calculator (use WynnBuilder instead)</li>
              <li className="indent-8">- A way to check if a build has enough mana (use WynnMana instead)</li>
              <li className="indent-8">- An item database (use WynnAtlas instead)</li>
            </ul>
            Instead, this tool is meant as a means to compare different pieces of gear with each other.<br/><br/>
          </p> : <></>
        }
        <p className="text-slate-400 hover:text-slate-600 cursor-pointer transition w-56" onClick={() => setShowCalcs(!showCalcs)}>How are indices calculated?</p>
        {
          showCalcs ? <p>
            <ul>
              <li className="indent-8">- Spell index: The spell index is the damage increase of a theoretical spell which has 100% neutral spell conversion as a result of equipping an item.</li>
              <li className="indent-8">- Melee index: The melee index is the increase in melee DPS as a result of equipping an item.</li>
              <li className="indent-8">- Poison index: The poison index is the increase in poison DPS as a result of equipping an item. A red asterisk indicates that the item has negative poison, potentially negating the gains from other gear.</li>
              <li className="indent-8">- Mana index: The mana index is the approximate mana value saved per second as a result of equipping an item. A red asterisk indicates that the gear uses percent spell costs, which is dependent on the original cost, ability tree cost reductions, and raw spell cost reductions from other pieces.</li>
              <li className="indent-8">- Skill point index: The skill point index is the total SP gained in the relevant SP. Tt does not count SP that is excluded by the user. A red asterisk indicates that the item has negative SP in non-excluded SP.</li>
              <li className="indent-8">- Health index: The skill point index is the total health gain from the item. A red asterisk indicates that some or all of the health is rollable.</li>
              <li className="indent-8">- Health sustain index: The health sustain index is the approximate health regenerated per second as a result of equipping an item. A red asterisk indicates that the item has health regen %, which may positively or negatively affect bonuses from other gear.</li>
              <li className="indent-8">- Walkspeed index: The walkspeed index is simply the walkspeed on the item.</li>
            </ul>
            Indices are meant to be easily calculated, and generalisable to a class’ various archetypes/playstyles. For this reason, they exclude specific aspects of the damage calculation process, introducing inaccuracies. Index calculations exclude:
            <ul>
              <li className="indent-8">- Spell conversions (spell indices are calculated assuming conversion is 100% neutral)</li>
              <li className="indent-8">- Major IDs</li>
              <li className="indent-8">- Abilities (indices are calculated assuming no playstyle-altering nodes are unlocked)</li>
              <li className="indent-8">- Skill point damage bonuses</li>
            </ul>
          </p> : <></>
        }
      </div>
      <form className="flex flex-col gap-2 w-96" onSubmit={onFormSubmit}>
        <h2 className="text-xl font-bold">Class/Weapon</h2>
        <div>
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

        <h2 className="text-xl font-bold">Playstyle</h2>
        <div className={weaponType === "" ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="playstyle">Playstyle: </label>
          <select id="playstyle" name="playstyle" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" value={useSteals ? "steals" : "regen"} onChange={onPlaystyleChange}>
            <option value="steals">Hybrid or Melee (MR/MS)</option>
            <option value="regen">Spellspam (Only MR)</option>
          </select>
        </div>

        <div className={weaponType === "" ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="cps">CPS: </label>
          <input type="number" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition w-16" value={cps} onChange={onCPSChange} />
        </div>

        <div className={weaponType === "" ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="cps">Spell Cycle (i.e. 1334): </label>
          <input type="text" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition w-32" value={spellCycle} onChange={onSpellCycleChange} pattern={"[1-4]+"} />
        </div>

        <div className={weaponType === "" ? "pointer-events-none opacity-40 select-none transition-all" : "transition-all"}>
          <label htmlFor="int">Estimated Int: </label>
          <select id="int" name="int" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" value={int} onChange={onIntChange}>
            <option value="0">0 int</option>
            <option value="30">30 int</option>
            <option value="60">60 int</option>
            <option value="120">120 int</option>
          </select>
        </div>

        <h2 className="text-xl font-bold">Filters</h2>
        <div>
          <label htmlFor="wpn">Gear: </label>
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" value={gearType} onChange={onGearChange}>
            <option disabled value="default"> -- select an option -- </option>
            <option value="all">All</option>
            <option value="armor">Armor</option>
            <option value="accessories">Accessories</option>
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
          <label htmlFor="playstyle">Exclude Skill Points: </label> <br/>
          <label htmlFor="str">Strength: </label>
          <input type="checkbox" id="str" name="str" checked={sp[0]} onChange={(e) => onSpChange(e, 0)} /><br/>
          <label htmlFor="dex">Dexterity: </label>
          <input type="checkbox" id="dex" name="dex" checked={sp[1]} onChange={(e) => onSpChange(e, 1)} /><br/>
          <label htmlFor="int">Intelligence: </label>
          <input type="checkbox" id="int" name="int" checked={sp[2]} onChange={(e) => onSpChange(e, 2)} /><br/>
          <label htmlFor="def">Defense: </label>
          <input type="checkbox" id="def" name="def" checked={sp[3]} onChange={(e) => onSpChange(e, 3)} /><br/>
          <label htmlFor="agi">Agility: </label>
          <input type="checkbox" id="agi" name="agi" checked={sp[4]} onChange={(e) => onSpChange(e, 4)} />
        </div>

        <div>
          <label htmlFor="level">Max Level: </label>
          <input type="number" id="level" name="level" className="bg-slate-200 rounded-md p-1 transition w-16" value={levelReq} onChange={onLevelChange} />
        </div>

        <div>
          <label htmlFor="playstyle">Sort By: </label>
          <select id="sortby" name="sortby" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" onChange={onSortByChange}>
            <option value="spell">Spell Damage</option>
            <option value="melee">Melee Damage</option>
            <option value="poison">Poison</option>
            <option value="mana">Mana Sustain</option>
            <option value="skillPoints">Skill Points</option>
            <option value="health">Health</option>
            <option value="walkspeed">Walkspeed</option>
            <option value="life">Life Sustain</option>
            <option value="healing">Healing</option>
            <option value="major">Major ID</option>
          </select> 
        </div>

        <div>
          <label htmlFor="showamt">Number of Results: </label>
          <select id="showamt" name="showamt" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" value={showAmt} onChange={onShowAmtChange}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select> 
        </div>
        
        <input type="submit" value="Calculate Gear Indices" className="bg-slate-700 rounded-md p-1 hover:bg-slate-500 text-white transition cursor-pointer" />
      </form>

      <div>
        <h2 className="text-xl font-bold">Results</h2>
        <div className="border border-slate-600">
          <div className="m-2 flex text-sm">
            <p className="w-64 font-bold">Name</p>
            <p className="w-32 font-bold">Spell</p>
            <p className="w-32 font-bold">Melee</p>
            <p className="w-32 font-bold">Poison</p>
            <p className="w-32 font-bold">Mana</p>
            <p className="w-24 font-bold">SP</p>
            <p className="w-32 font-bold">Health</p>
            <p className="w-24 font-bold">WS</p>
            <p className="w-32 font-bold">Life Sustain</p>
            <p className="w-24 font-bold">Healing</p>
            <p className="w-64 font-bold">Major ID</p>
          </div>
          {
            indices ? indices.map((index) => {
              return <Item 
                key={index.name}
                toggleBg={indices.indexOf(index) % 2 === 1}
                index={index} />
            }) : <></>
          }
        </div>
      </div>
    </main>
  );
}
