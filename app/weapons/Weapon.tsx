import { Indices } from "../page"

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
      <div style={{backgroundColor: toggleBg ? '#f0f0f0' : '#ffffff'}} className="p-2 flex">
        <p style={{color: getRarityColor(index.rarity)}} className="w-64">Lv. {index.level} { index.name }</p>
        <p style={{color: getSignColor(baseDps)}} className="w-32">{ baseDps.toFixed(2) }</p>
        <p style={{color: getSignColor(index.spell[0])}} className="w-32">{ index.spell[0].toFixed(2) }</p>
        <p style={{color: getSignColor(index.melee[0])}} className="w-32">{ index.melee[0].toFixed(2) } <i className="text-black">{getMeleeType(index.melee[1])}</i></p>
        <p style={{color: getSignColor(index.poison[0])}} className="w-32">{ index.poison[0].toFixed(2) }<strong className="text-red-600">{index.poison[1] === "neg" ? "*" : ""}</strong></p>
        <p style={{color: getSignColor(index.mana[0])}} className="w-32">{ index.mana[0].toFixed(2) }<strong className="text-red-600">{index.mana[1] === "pct" ? "*" : ""}</strong></p>
        <p style={{color: getSignColor(index.skillPoints[0])}} className="w-24">{ index.skillPoints[0] }<strong className="text-red-600">{index.skillPoints[1] === "neg" ? "*" : ""}</strong></p>
        <p style={{color: getSignColor(index.health[0])}} className="w-32">{ index.health[0] }<strong className="text-red-600">{index.health[1] === "rol" ? "*" : ""}</strong></p>
        <p style={{color: getSignColor(index.walkspeed[0])}} className="w-24">{ index.walkspeed[0] }</p>
        <p style={{color: getSignColor(index.life[0])}} className="w-32">{ index.life[0].toFixed(2) }<strong className="text-red-600">{index.life[1] === "pct" ? "*" : ""}</strong></p>
        <p style={{color: getSignColor(index.healing[0])}} className="w-24">{ index.healing[0] }</p>
        <p className="w-64 text-blue-400">{ index.major[0] }</p>
      </div>
    );
  }
  