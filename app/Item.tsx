import { Indices } from "./itemTypes"
import { useState } from "react";

type ItemProps = {
    toggleBg: boolean;
    index: Indices;
}

export default function Item({ toggleBg, index }: ItemProps) {
    const [showDetails, setShowDetails] = useState(false);

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

    const onNameClick = () => {
        setShowDetails(!showDetails);
    }

    return (
        <section style={{backgroundColor: toggleBg ? '#f0f0f0' : '#ffffff'}} className="p-2 text-sm">
            <div className="flex">
                <p style={{color: getRarityColor(index.general.rarity)}} className="w-64 cursor-pointer hover:opacity-40 transition-all" onClick={onNameClick} >Lv. {index.general.level} { index.general.name }</p>
                <p style={{color: getSignColor(index.spell.value)}} className="w-48">{ index.spell.value.toFixed(2) }</p>
                <p style={{color: getSignColor(index.melee.value)}} className="w-48">{ index.melee.value.toFixed(2) }</p>
                <p style={{color: getSignColor(index.mana.value)}} className="w-48">{ index.mana.value.toFixed(2) }</p>
                <p style={{color: getSignColor(index.skillPoints.value)}} className="w-24">{ index.skillPoints.value }</p>
                <p style={{color: getSignColor(index.health.value)}} className="w-48">{ index.health.value }</p>
                <p style={{color: getSignColor(index.life.value)}} className="w-48">{ index.life.value.toFixed(2) }</p>
                <p className="w-48">{ index.other.value }</p>
                <p className="w-48">{ index.minor.value }</p>
            </div>
            { showDetails &&
            <div className="pt-2 flex text-slate-400 text-xs">
                <div className="flex flex-col w-64">
                    { index.general.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
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
                    { index.mana.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-24">
                    { index.skillPoints.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
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
                    { index.other.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.minor.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
            </div>
            }
        </section>
    );
  }
  