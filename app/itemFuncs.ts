import { POWDERS, ATK_MULTIPLIERS, Powder } from "./constants";
import { Item, ItemList, Damage, IDs } from "./page";

// Get the base damages/base attack speed of a weapon
const getDamages = (weapon: Item): Damage => {
    const base = weapon['base']
    if (base) {
        return {
            baseAtkMult: ATK_MULTIPLIERS[weapon["attackSpeed"]],
            damages: {
                neutral: 'damage' in base ? base['damage'] : {'min': 0, 'max': 0},
                earth: 'earthDamage' in base ? base['earthDamage'] : {'min': 0, 'max': 0},
                thunder: 'thunderDamage' in base ? base['thunderDamage'] : {'min': 0, 'max': 0},
                water: 'waterDamage' in base ? base['waterDamage'] : {'min': 0, 'max': 0},
                fire: 'fireDamage' in base ? base['fireDamage'] : {'min': 0, 'max': 0},
                air: 'airDamage' in base ? base['airDamage'] : {'min': 0, 'max': 0}
            }
        }
    }
    return {
        baseAtkMult: ATK_MULTIPLIERS[weapon["attackSpeed"]],
        damages: {
            neutral: {'min': 0, 'max': 0},
            earth: {'min': 0, 'max': 0},
            thunder: {'min': 0, 'max': 0},
            water: {'min': 0, 'max': 0},
            fire: {'min': 0, 'max': 0},
            air: {'min': 0, 'max': 0}
        }
    }
}

// `Compress` powders such that bonuses from adjacent powders of the same element are merged together
const compressPowders = (powders: string): Powder[] => {
    let powderArray: string[] = [];
    let compressedArray: Powder[] = [];

    for (let i = 0; i < powders.length; i += 2) {
        powderArray.push(powders.substring(i, i + 2));
    }
    
    for (let i = 0; i < powderArray.length; i++) {
        const pwdInfo = POWDERS[powderArray[i]];
        // If the elemental type of the powder is the same as the last applied
        if (compressedArray.length !== 0 && compressedArray[compressedArray.length - 1]['element'] === pwdInfo['element']) {
            const lastPowder: Powder = compressedArray.pop() || {damages: {inc_min: 0,inc_max: 0}, conversion: 0, element: 'earth'};;
            const newIncMin = lastPowder['damages']['inc_min'] + pwdInfo['damages']['inc_min'];
            const newIncMax = lastPowder['damages']['inc_max'] + pwdInfo['damages']['inc_max'];
            const newConversion = Math.max(Math.min(lastPowder['conversion'] + pwdInfo['conversion'], 1), 0);
            compressedArray.push({
                'damages': {
                    'inc_min': newIncMin,
                    'inc_max': newIncMax
                },
                'conversion': newConversion,
                'element': pwdInfo['element']
            })
        }
        else {
            compressedArray.push(pwdInfo);
        }
    }

    return compressedArray;
}

// Apply an array of `Powder`s to a `Damage` object and returns a new `Damage` object
const applyPowders = (damage: Damage, powders: Powder[]): Damage => {
    let newDamage = structuredClone(damage);
    for (let i = 0; i < powders.length; i++) {
        const element: 'earth' | 'thunder' | 'water' | 'fire' | 'air' = powders[i]['element'];
        const oldNeutral = newDamage['damages']['neutral'];
        const oldElemental = newDamage['damages'][element];

        newDamage['damages']['neutral'] = {
            'min': oldNeutral['min'] * (1 - powders[i]['conversion']),
            'max': oldNeutral['max'] * (1 - powders[i]['conversion'])
        }
        newDamage['damages'][element] = {
            'min': oldElemental['min'] + powders[i]['damages']['inc_min'] + (oldNeutral['min'] * powders[i]['conversion']),
            'max': oldElemental['max'] + powders[i]['damages']['inc_max'] + (oldNeutral['max'] * powders[i]['conversion'])
        }
    }
    return newDamage;
}

// Returns average Base DPS given a damage array
const getBaseDPS = (damage: Damage): number => {
    let minSum = 0;
    let maxSum = 0;

    let key: keyof Damage['damages'];
    for (key in damage['damages']) {
        minSum += damage['damages'][key]['min']
        maxSum += damage['damages'][key]['max']
    }

    return damage['baseAtkMult'] * ((minSum + maxSum) / 2);
}

// Get the maximum possible ID on a rollable item, or just the ID on a static item
const getIDMax = (ids: IDs, idName: string): number => {
    if (idName in ids) {
        const id = ids[idName]
        if (typeof id === 'number') {
            return id;
        }
        else {
            return id['max'];
        }
    }
    return 0;
}

export const calcSpellDamage = () => {

}

export const calcMeleeDamage = () => {

}

export const calcPoisonDamage = () => {

}

const accumulateIDs = () => {

}

export const getSpellIndex = () => {

}

export const getMeleeIndex = () => {

}

export const getPoisonIndex = () => {
    
}

export const getManaIndex = () => {

}

export const getLifeIndex = () => {
    
}

export const getIndices = (weapon: Item, powdering: string, gear: Item, steals: boolean, cps: number, spellCycle: string) => {

}

export const testIndices = (weapon: Item, powdering: string, gear: Item, steals: boolean, cps: number, spellCycle: string) => {
    console.log("========== PARAMETERS ==========");
    console.log("Weapon: " + JSON.stringify(weapon));
    console.log("Powdering: " + powdering);
    console.log("Gear: " + JSON.stringify(gear));
    console.log("Steals: " + steals);
    console.log("CPS: " + cps);
    console.log("Spell Cycle: " + spellCycle);

    const baseDamage: Damage = getDamages(weapon);

    console.log("========== GET WEAPON DAMAGE ==========");
    console.log("Base Damage: " + JSON.stringify(baseDamage));

    const powdersToApply: Powder[] = compressPowders(powdering);

    console.log("========== COMPRESS POWDERS ==========");
    console.log("Powdering: " + powdering);
    console.log("Powder Array: " + JSON.stringify(powdersToApply));

    const powderedDamage: Damage = applyPowders(baseDamage, powdersToApply);

    console.log("========== APPLY POWDERS ==========");
    console.log("After Powder Damage: " + JSON.stringify(powderedDamage));
    
    console.log("========== GET BASE DPS ==========");
    console.log("Base DPS (Unpowdered): " + getBaseDPS(baseDamage));
    console.log("Base DPS (Powdered): " + getBaseDPS(powderedDamage));

    console.log("========== GET ID MAX ==========");
    console.log("Mana Regen on Weapon: " + getIDMax(weapon['identifications'], 'manaRegen'))
    console.log("Mana Regen on Armor: " + getIDMax(gear['identifications'], 'manaRegen'))
    console.log("Fire Damage on Weapon: " + getIDMax(weapon['identifications'], 'fireDamage'))
    console.log("Fire Damage on Armor: " + getIDMax(gear['identifications'], 'fireDamage'))
    console.log("Life Steal on Weapon: " + getIDMax(weapon['identifications'], 'lifeSteal'))
    console.log("Life Steal on Armor: " + getIDMax(gear['identifications'], 'lifeSteal'))

    console.log("========== CALCULATE SPELL INDEX ==========");
    console.log("========== CALCULATE MELEE INDEX ==========");
    console.log("========== CALCULATE POISON INDEX ==========");
    console.log("========== CALCULATE MANA SUSTAIN INDEX ==========");
    console.log("========== CALCULATE LIFE SUSTAIN INDEX ==========");
}
