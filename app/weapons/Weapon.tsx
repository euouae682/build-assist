import { Indices } from "../itemTypes"
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
            return 'inherit';
        }
    }

    const getSignColor = (index: number): string => {
        if (index > 0.001) {
            return '#07ad0a';
        }
        else if (index < -0.001) {
            return '#ff0f0f';
        }
        return 'inherit';
    }

    const getDetailWidth = (index: string): string => {
        if (index == "name" || index == "general") {
            return "flex flex-col w-64";
        }
        else if (index == "skillPoints") {
            return "flex flex-col w-24";
        }
        return "flex flex-col w-48";
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
        <section style={{backgroundColor: toggleBg ? 'var(--dark-cell)' : 'var(--light-cell)'}} className="p-2 text-[12px]">
            <div className="flex">
                <p style={{color: getRarityColor(index.general.rarity)}} className="w-72 cursor-pointer hover:opacity-40 transition-all" onClick={onNameClick}>Lv. {index.general.level} { index.general.name }</p>
                <p style={{color: getSignColor(index.baseDps != undefined ? index.baseDps.value : -1)}} className="w-48">{ index.baseDps != undefined ? index.baseDps.value.toFixed(2) : -1 }</p>
                <p style={{color: getSignColor(index.spell.value)}} className="w-48">{ index.spell.value.toFixed(2) }</p>
                <p style={{color: getSignColor(index.melee.value)}} className="w-48">{ index.melee.value.toFixed(2) } 
                    <em style={{color: "white"}}>
                    { index.melee.details[index.melee.details.length - 1].startsWith("Atk Speed: -") ? " (drop)" : (index.melee.details[index.melee.details.length - 1].startsWith("Atk Speed") ? " (tier)" : "") }</em>
                </p>
                <p style={{color: getSignColor(index.skillPoints.value)}} className="w-24">{ index.skillPoints.value }</p>
                <p style={{color: getSignColor(index.mana.value)}} className="w-48">{ index.mana.value.toFixed(2) }</p>
                <p style={{color: getSignColor(index.health.value)}} className="w-48">{ index.health.value }</p>
                <p style={{color: getSignColor(index.life.value)}} className="w-48">{ index.life.value.toFixed(2) }</p>
                <p className="w-48">{ index.other.value }</p>
                <p className="w-48">{ index.minor.value }</p>
            </div>
            { showDetails &&
            <div className="pt-2 flex text-slate-400 text-xs">
                <div className="flex flex-col w-72">
                    { index.general.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.baseDps ? index.baseDps.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) : <></> }
                </div>
                <div className="flex flex-col w-48">
                    { index.spell.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.melee.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-24">
                    { index.skillPoints.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.mana.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.health.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
                </div>
                <div className="flex flex-col w-48">
                    { index.life.details.map((phrase) => {
                        return <p key={phrase}>{ phrase }</p>
                    }) }
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
  