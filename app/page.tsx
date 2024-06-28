'use client';

import React, { useState } from "react";
import Item from "./Item";

export default function Home() {
  const [wClass, setWClass] = useState('');
  const [weapon, setWeapon] = useState('');
  const [powdering, setPowdering] = useState('');

  const [processedList, setProcessedList] = useState([]);

  return (
    <main className="m-16 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold leading-12">Wynncraft Build Assist</h1>
        <h2 className="text-2xl">a goofy web app by euouae</h2>
      </div>
      <form className="w-64 flex flex-col gap-2">
        <div>
          <h2 className="text-xl font-bold">Class/Weapons</h2>
          <label htmlFor="cla">Class: </label>
          <select id="cla" name="cla" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer">
            <option value="archer">Archer/Hunter</option>
            <option value="warrior">Warrior/Knight</option>
            <option value="shaman">Shaman/Skyseer</option>
            <option value="mage">Mage/Dark Wizard</option>
            <option value="assassin">Assassin/Ninja</option>
          </select>
        </div>

        <div>
          <label htmlFor="wpn">Weapon: </label>
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer">
            <option value="prowl">Prowl</option>
            <option value="cluster">Cluster</option>
            <option value="infusedhivebow">Infused Hive Bow</option>
            <option value="air in a can">Air In A Can</option>
          </select>
        </div>

        <div>
          <label htmlFor="pwd">Powdering: </label>
          <input type="text" id="pwd" name="pwd" className="bg-slate-200 rounded-md p-1 transition" />
        </div>

        <div>
          <label htmlFor="wpn">Gear: </label>
          <select id="wpn" name="wpn" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer">
            <option value="helmet">Helmet</option>
            <option value="chestplate">Chestplate</option>
            <option value="leggings">Leggings</option>
            <option value="boots">Boots</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
            <option value="necklace">Necklace</option>
          </select>
        </div>

        <input type="submit" value="Calculate Gear Indices" className="bg-slate-700 rounded-md p-1 hover:bg-slate-600 text-white transition cursor-pointer" />
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Ordering</h2>
        <div className="flex gap-4">
          <label htmlFor="playstyle">Sort By: </label>
          <select id="sortby" name="sortby" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer">
            <option value="spell">Spell Damage</option>
            <option value="melee">Melee Damage</option>
            <option value="poison">Poison</option>
            <option value="mana">Mana Sustain</option>
            <option value="life">Life Sustain</option>
          </select>

          <label htmlFor="playstyle">Playstyle: </label>
          <select id="playstyle" name="playstyle" className="bg-slate-200 rounded-md p-1 hover:bg-slate-300 transition cursor-pointer">
            <option value="mr">Spellspam (Only MR)</option>
            <option value="mrms">Hybrid (MR/MS)</option>
          </select>

          <label htmlFor="cps">CPS: </label>
          <input type="text" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition" />

          <label htmlFor="cps">Spell Cycle: </label>
          <input type="text" id="cps" name="cps" className="bg-slate-200 rounded-md p-1 transition" />
        </div>
      </div>

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
          <Item name="Aphotic" rarity="legendary" spell={400} melee={-150} poison={0} mana={4} life={0} />
          <Item name="Sano's Care" rarity="unique" spell={0} melee={0} poison={0} mana={3} life={400} />
          <Item name="Nighthawk" rarity="fabled" spell={190} melee={-80} poison={0} mana={6} life={0} />
        </div>
      </div>
    </main>
  );
}
