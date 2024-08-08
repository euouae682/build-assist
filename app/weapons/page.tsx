'use client';

import React, { useState, useEffect } from "react";
import { ItemList, Indices } from "../itemTypes";
import Weapon from "./Weapon";
import { getWeaponIndices } from "../itemFuncs";
import { SPELL_COSTS } from "../constants";

export default function Home() {
  // Form state variables - general
  const [weaponType, setWeaponType] = useState('');
  const [powderTier, setPowderTier] = useState(6);
  const [sp, setSp] = useState<[boolean, boolean, boolean, boolean, boolean]>([false, false, false, false, false]);
  const [levelReq, setLevelReq] = useState(105);

  // Form state variables - CPS/Steals
  const [useSteals, setUseSteals] = useState(true);
  const [cps, setCps] = useState(6);
  const [spellCycle, setSpellCycle] = useState('1234');
  const [int, setInt] = useState('60');
  const [costs, setCosts] = useState<[number, number, number, number]>([35, 20, 35, 30]);

  // Form state variables - Sort by
  const [sortBy, setSortBy] = useState('dps');
  const [showAmt, setShowAmt] = useState(100);

  // Data state variables
  const [itemsList, setItemsList] = useState<ItemList | null>(null);
  const [weaponsList, setWeaponsList] = useState<string[] | null>(null);
  const [indices, setIndices] = useState<[number, Indices][] | null>(null);

  useEffect(() => {
    getItems();
  }, [])

  useEffect(() => {
    if (itemsList !== null) {
      setWeaponsList(Object.entries(itemsList)
        .filter((item) => {
          return 'type' in item[1] && item[1]['type'] === weaponType
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
  }, [itemsList, weaponType, sp, levelReq])

  async function getItems() {
    const response = await fetch('./data.json');
    const json: ItemList = await response.json();
    setItemsList(json);
  }

  const calculateWeaponBoosts = (): void => {
    let indicesList: [number, Indices][] = [];
    if (itemsList != null && weaponsList != null) {
      weaponsList.map((weaponName) => {
        indicesList.push(getWeaponIndices(weaponName, itemsList[weaponName], powderTier, useSteals, cps, spellCycle, costs, sp));
      })
    }

    if (sortBy === "dps" || sortBy === "spell" || sortBy === "melee"
      || sortBy === "mana" || sortBy === "skillPoints" || sortBy === "health"
      || sortBy === "life") {
      sortList(indicesList, sortBy);
    }
    setIndices(indicesList.slice(0, showAmt));
  }

  const sortList = (list: [number, Indices][], key: "dps" | "spell" | "melee" | "mana" | "skillPoints" | "health" | "life"): [number, Indices][] => {
    if (list !== null) {
      if (key === "dps") {
        return list.sort((index1, index2) => index2[0] - index1[0])
      }
      // else if (key === "major") {
      //   return list.sort((index1, index2) => index2[1]["major"][0].localeCompare(index1[1]["major"][0]))
      // }
      return list.sort((index1, index2) => index2[1][key][0] - index1[1][key][0]);
    }
    return [];
  }

  const onClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setWeaponType(e.target.value);
    setCosts(SPELL_COSTS[e.target.value][int]);
  }

  const onPowderChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setPowderTier(Number(e.target.value));
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

    if (cps === 0) {
      alert("Warning: CPS must be a positive number!");
    }
    else if (spellCycle === '') {
      alert("Warning: Spell cycle not entered!")
    }
    else if (sortBy === '') {
      alert("Warning: Index to sort by not selected!");
    }
    else {
      calculateWeaponBoosts();
    }
  }

  return (
    <main className="m-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold leading-12">Wynncraft Build Assist</h1>
        <h2 className="text-2xl">a goofy web app by euouae</h2>
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

        <div className="transition-all">
          <label htmlFor="ptier">Powder Tier: </label>
          <select id="ptier" name="ptier" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer" defaultValue="6" onChange={onPowderChange}>
            <option value="6">VI</option>
            <option value="5">V</option>
            <option value="4">IV</option>
            <option value="3">III</option>
            <option value="2">II</option>
            <option value="1">I</option>
            <option value="0">No Powders</option>
          </select>
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
            <option value="dps">Base DPS</option>
            <option value="spell">Spell Damage</option>
            <option value="melee">Melee Damage</option>
            {/* <option value="poison">Poison</option> */}
            <option value="mana">Mana Sustain</option>
            <option value="skillPoints">Skill Points</option>
            <option value="health">Health</option>
            {/* <option value="walkspeed">Walkspeed</option> */}
            <option value="life">Life Sustain</option>
            {/* <option value="healing">Healing</option>
            <option value="major">Major ID</option> */}
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
        <div className="border border-slate-600 text-sm">
          <div className="m-2 flex">
            <p className="w-64 font-bold">Name</p>
            <p className="w-48 font-bold">Base DPS</p>
            <p className="w-48 font-bold">Spell</p>
            <p className="w-48 font-bold">Melee</p>
            {/* <p className="w-32 font-bold">Poison</p> */}
            <p className="w-48 font-bold">Mana</p>
            <p className="w-32 font-bold">SP</p>
            <p className="w-48 font-bold">Health</p>
            {/* <p className="w-24 font-bold">WS</p> */}
            <p className="w-48 font-bold">Life Sustain</p>
            {/* <p className="w-24 font-bold">Healing</p>
            <p className="w-64 font-bold">Major ID</p> */}
          </div>
          {
            indices ? indices.map((index) => {
              return <Weapon 
                key={index[1].name}
                toggleBg={indices.indexOf(index) % 2 === 1}
                baseDps={index[0]}
                index={index[1]} />
            }) : <></>
          }
        </div>
      </div>
    </main>
  );
}
