import { Indices } from "../itemTypes"

type ItemProps = {
    toggleBg: boolean;
    baseDps: number;
    index: Indices;
}

export default function Item({ toggleBg, baseDps, index }: ItemProps) {
    const getRarityColor = (rarity: string): string => {
        if (rarity === "set") {
            return '#09eb0d'
        }
        else if (rarity === "unique") {
            return '#ccbc06';
        }
        else if (rarity === "rare") {
            return '#ff0fff';
        }
        else if (rarity === "legendary") {
            return '#0fbfff';
        }
        else if (rarity === "fabled") {
            return '#ff0f0f';
        }
        else if (rarity === "mythic") {
            return '#bb0fff';
        }
        else {
            return 'black';
        }
    }

    const getSignColor = (index: number): string => {
        if (index > 0.001) {
            return '#07ad0a';
        }
        else if (index < -0.001) {
            return '#ff0f0f';
        }
        return 'black';
    }

    const getMeleeType = (type: string): string => {
        if (type === "ts") {
            return "(tier)";
        }
        else if (type === "td") {
            return "(drop)";
        }
        return "";
    }

    return (
        <section style={{backgroundColor: toggleBg ? '#f0f0f0' : '#ffffff'}} className="p-2 text-sm">
            <div className="flex">
                <p style={{color: getRarityColor(index.rarity)}} className="w-64">Lv. {index.level} { index.name }</p>
                <p style={{color: getSignColor(baseDps)}} className="w-48">{ baseDps.toFixed(2) }</p>
                <p style={{color: getSignColor(index.spell[0])}} className="w-48">{ index.spell[0].toFixed(2) }</p>
                <p style={{color: getSignColor(index.melee[0])}} className="w-48">{ index.melee[0].toFixed(2) } <i className="text-black">{getMeleeType(index.melee[1])}</i></p>
                <p style={{color: getSignColor(index.mana[0])}} className="w-48">{ index.mana[0].toFixed(2) }<strong className="text-red-600">{index.mana[1] === "pct" ? "*" : ""}</strong></p>
                <p style={{color: getSignColor(index.skillPoints[0])}} className="w-24">{ index.skillPoints[0] }<strong className="text-red-600">{index.skillPoints[1] === "neg" ? "*" : ""}</strong></p>
                <p style={{color: getSignColor(index.health[0])}} className="w-48">{ index.health[0] }<strong className="text-red-600">{index.health[1] === "rol" ? "*" : ""}</strong></p>
                <p style={{color: getSignColor(index.life[0])}} className="w-48">{ index.life[0].toFixed(2) }<strong className="text-red-600">{index.life[1] === "pct" ? "*" : ""}</strong></p>
                <p className="w-48">111</p>
                <p className="w-48">111</p>
            </div>
            <div className="pt-2 flex">
                <div className="flex flex-col w-64">
                    <p>Str Req: XXX</p>
                    <p>Dex Req: XXX</p>
                    <p>Int Req: XXX</p>
                    <p>Def Req: XXX</p>
                    <p>Agi Req: XXX</p>
                    <p>Quest Req: XXXXXXXXXXXX</p>
                    <p>Slots: XX</p>
                    <p>Major ID: XXXXXXXXXXXX</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>XX% N, ±XXX</p>
                    <p>XX% E, ±XXX</p>
                    <p>XX% T, ±XXX</p>
                    <p>XX% W, ±XXX</p>
                    <p>XX% F, ±XXX</p>
                    <p>XX% A, ±XXX</p>
                    <p>Speed: super_slow</p>
                    <p>Slots: XX</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Spell: +XXX%, +XXXX</p>
                    <p>Elemt. Spell: XX%, XX</p>
                    <p>Thunder Spell: +XXX%, +XXXX</p>
                    <p>Thunder: +XXX%, +XXXX</p>
                    <p>Fire: XX%, XX</p>
                    <p>Air: XXX</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Melee: XX%, XX</p>
                    <p>Elemt. Melee: XX%, XX</p>
                    <p>Earth: -XX%</p>
                    <p>Thunder Melee: XXX</p>
                    <p>Fire: XX%, XX</p>
                    <p>Air Melee: XXX</p>
                    <p>Speed Bonus: +XX</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Mana Regen: +XXX/5s</p>
                    <p>Mana Steal: +XXX/3s</p>
                    <p>1st Spell: +XXXX, +XXX%</p>
                    <p>2nd Spell: +XXXX, +XXX%</p>
                    <p>3rd Spell: +XXXX, +XXX%</p>
                    <p>4th Spell: +XXXX, +XXX%</p>
                </div>
                <div className="flex flex-col w-24">
                    <p>Str: XX</p>
                    <p>Dex: XX</p>
                    <p>Int: XX</p>
                    <p>Def: XX</p>
                    <p>Agi: XX</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Base HP: XXXXX</p>
                    <p>Bonus HP: +XXXXX</p>
                    <p>Earth Def: +XXXX, +XXX%</p>
                    <p>Thunder Def: +XXXX, +XXX%</p>
                    <p>Water Def: +XXXX, +XXX%</p>
                    <p>Fire Def: +XXXX, +XXX%</p>
                    <p>Air Def: +XXXX, +XXX%</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>HP Regen: +XXX, +XXX%</p>
                    <p>Life Steal: +XXXX/3s</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Poison: +XXXXX/3s</p>
                    <p>Walkspeed: +XXX%</p>
                    <p>Jump Height: +XX</p>
                    <p>Healing Eff: +XXX%</p>
                    <p>Knockback: +XXX%</p>
                    <p>Slow Enemy: +XXX%</p>
                    <p>Weaken Enemy: +XXX%</p>
                    <p>XP Bonus: +XXX%</p>
                    <p>Loot Bonus: +XXX%</p>
                </div>
                <div className="flex flex-col w-48">
                    <p>Thorns: +XXX%</p>
                    <p>Reflection: +XXX%</p>
                    <p>Exploding: +XXX%</p>
                    <p>Stealing: +XXX%</p>
                    <p>Sprint: +XXX%</p>
                    <p>Sprint Regen: +XXX%</p>
                </div>
            </div>
        </section> 
    );
  }
  