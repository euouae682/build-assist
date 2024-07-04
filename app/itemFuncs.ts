import { POWDERS, ATK_MULTIPLIERS, SPELL_COSTS, Powder } from "./constants";
import { Item, ItemList, Damage, IDs, Indices } from "./page";

// Get the base damages/base attack speed of a weapon
const getDamages = (weapon: Item): Damage => {
    const base = weapon['base']
    if (base) {
        return {
            baseAtkMult: ATK_MULTIPLIERS[weapon["attackSpeed"]],
            damages: {
                neutral: 'damage' in base && typeof base['damage'] !== "number" ? base['damage'] : {'min': 0, 'max': 0},
                earth: 'earthDamage' in base && typeof base['earthDamage'] !== "number" ? base['earthDamage'] : {'min': 0, 'max': 0},
                thunder: 'thunderDamage' in base && typeof base['thunderDamage'] !== "number" ? base['thunderDamage'] : {'min': 0, 'max': 0},
                water: 'waterDamage' in base && typeof base['waterDamage'] !== "number" ? base['waterDamage'] : {'min': 0, 'max': 0},
                fire: 'fireDamage' in base && typeof base['fireDamage'] !== "number" ? base['fireDamage'] : {'min': 0, 'max': 0},
                air: 'airDamage' in base && typeof base['airDamage'] !== "number" ? base['airDamage'] : {'min': 0, 'max': 0}
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

// Returns spell damage.
// Specifically, returns the average damage of a theoretical spell with 100% neutral spell conversion.
export const calcSpellDamage = (damage: Damage, ids: IDs) => {
    const spellPct = getIDMax(ids, "spellDamage") / 100;
    const spellRaw = getIDMax(ids, "rawSpellDamage");

    const nPct = getIDMax(ids, "neutralDamage") / 100 + getIDMax(ids, "neutralSpellDamage") / 100;
    const nRaw = getIDMax(ids, "rawNeutralDamage") + getIDMax(ids, "rawNeutralSpellDamage");
    const ePct = getIDMax(ids, "earthDamage") / 100 + getIDMax(ids, "earthSpellDamage") / 100;
    const eRaw = getIDMax(ids, "rawEarthDamage") + getIDMax(ids, "rawEarthSpellDamage");
    const tPct = getIDMax(ids, "thunderDamage") / 100 + getIDMax(ids, "thunderSpellDamage") / 100;
    const tRaw = getIDMax(ids, "rawThunderDamage") + getIDMax(ids, "rawThunderSpellDamage");
    const wPct = getIDMax(ids, "waterDamage") / 100 + getIDMax(ids, "waterSpellDamage") / 100;
    const wRaw = getIDMax(ids, "rawWaterDamage") + getIDMax(ids, "rawWaterSpellDamage");
    const fPct = getIDMax(ids, "fireDamage") / 100 + getIDMax(ids, "fireSpellDamage") / 100;
    const fRaw = getIDMax(ids, "rawFireDamage") + getIDMax(ids, "rawFireSpellDamage");
    const aPct = getIDMax(ids, "airDamage") / 100 + getIDMax(ids, "airSpellDamage") / 100;
    const aRaw = getIDMax(ids, "rawAirDamage") + getIDMax(ids, "rawAirSpellDamage");
    const elePct = getIDMax(ids, "elementalDamage") / 100 + getIDMax(ids, "elementalSpellDamage") / 100;
    const eleRaw = getIDMax(ids, "rawElementalDamage") + getIDMax(ids, "rawElementalSpellDamage");

    let minTotal = 0;
    let maxTotal = 0;
    let hasElemental = false;

    let key: keyof Damage['damages'];
    for (key in damage['damages']) {
        let totalMod = 1 + spellPct;
        let totalRawMod = 0;

        if (key === "neutral") {
            totalMod += nPct;
            totalRawMod += nRaw;
        }
        else {
            hasElemental = true;
            totalMod += elePct;
            if (key === "earth") {
                totalMod += ePct;
                totalRawMod += eRaw;
            }
            else if (key === "thunder") {
                totalMod += tPct;
                totalRawMod += tRaw;
            }
            else if (key === "water") {
                totalMod += wPct;
                totalRawMod += wRaw;
            }
            else if (key === "fire") {
                totalMod += fPct;
                totalRawMod += fRaw;
            }
            else if (key === "air") {
                totalMod += aPct;
                totalRawMod += aRaw;
            }
        }

        const newMinDmg = ((damage["damages"][key]['min'] * damage["baseAtkMult"] * totalMod) + totalRawMod)
        const newMaxDmg = ((damage["damages"][key]['max'] * damage["baseAtkMult"] * totalMod) + totalRawMod)

        minTotal += newMinDmg >= 0 ? newMinDmg : 0;
        maxTotal += newMaxDmg >= 0 ? newMaxDmg : 0;
    }

    minTotal += spellRaw + (hasElemental ? eleRaw : 0);
    maxTotal += spellRaw + (hasElemental ? eleRaw : 0);

    return Math.max((minTotal + maxTotal) / 2, 0);
}

// Returns melee DPS.
export const calcMeleeDamage = (damage: Damage, ids: IDs) => {
    const meleePct = getIDMax(ids, "mainAttackDamage") / 100;
    const meleeRaw = getIDMax(ids, "rawMainAttackDamage");

    const nPct = getIDMax(ids, "neutralDamage") / 100 + getIDMax(ids, "neutralMainAttackDamage") / 100;
    const nRaw = getIDMax(ids, "rawNeutralDamage") + getIDMax(ids, "rawNeutralMainAttackDamage");
    const ePct = getIDMax(ids, "earthDamage") / 100 + getIDMax(ids, "earthMainAttackDamage") / 100;
    const eRaw = getIDMax(ids, "rawEarthDamage") + getIDMax(ids, "rawEarthMainAttackDamage");
    const tPct = getIDMax(ids, "thunderDamage") / 100 + getIDMax(ids, "thunderMainAttackDamage") / 100;
    const tRaw = getIDMax(ids, "rawThunderDamage") + getIDMax(ids, "rawThunderMainAttackDamage");
    const wPct = getIDMax(ids, "waterDamage") / 100 + getIDMax(ids, "waterMainAttackDamage") / 100;
    const wRaw = getIDMax(ids, "rawWaterDamage") + getIDMax(ids, "rawWaterMainAttackDamage");
    const fPct = getIDMax(ids, "fireDamage") / 100 + getIDMax(ids, "fireMainAttackDamage") / 100;
    const fRaw = getIDMax(ids, "rawFireDamage") + getIDMax(ids, "rawFireMainAttackDamage");
    const aPct = getIDMax(ids, "airDamage") / 100 + getIDMax(ids, "airMainAttackDamage") / 100;
    const aRaw = getIDMax(ids, "rawAirDamage") + getIDMax(ids, "rawAirMainAttackDamage");
    const elePct = getIDMax(ids, "elementalDamage") / 100 + getIDMax(ids, "elementalMainAttackDamage") / 100;
    const eleRaw = getIDMax(ids, "rawElementalDamage") + getIDMax(ids, "rawElementalMainAttackDamage");

    const attackSpeeds: number[] = [0.51, 0.83, 1.5, 2.05, 2.5, 3.1, 4.3];
    let curIndex = attackSpeeds.indexOf(damage['baseAtkMult']);
    curIndex += getIDMax(ids, "rawAttackSpeed");
    let newAtkMult = 0;

    if (curIndex < 0) {
        newAtkMult = 0.51;
    }
    else if (curIndex > attackSpeeds.length - 1) {
        newAtkMult = 4.3;
    }
    else {
        newAtkMult = attackSpeeds[curIndex];
    }

    let minTotal = 0;
    let maxTotal = 0;
    let hasElemental = false;

    let key: keyof Damage['damages'];
    for (key in damage['damages']) {
        let totalMod = 1 + meleePct;
        let totalRawMod = 0;

        if (key === "neutral") {
            totalMod += nPct;
            totalRawMod += nRaw;
        }
        else {
            hasElemental = true;
            totalMod += elePct;
            if (key === "earth") {
                totalMod += ePct;
                totalRawMod += eRaw;
            }
            else if (key === "thunder") {
                totalMod += tPct;
                totalRawMod += tRaw;
            }
            else if (key === "water") {
                totalMod += wPct;
                totalRawMod += wRaw;
            }
            else if (key === "fire") {
                totalMod += fPct;
                totalRawMod += fRaw;
            }
            else if (key === "air") {
                totalMod += aPct;
                totalRawMod += aRaw;
            }
        }

        const newMinDmg = ((damage["damages"][key]['min'] * totalMod) + totalRawMod)
        const newMaxDmg = ((damage["damages"][key]['max'] * totalMod) + totalRawMod)

        minTotal += newMinDmg >= 0 ? newMinDmg : 0;
        maxTotal += newMaxDmg >= 0 ? newMaxDmg : 0;
    }

    minTotal += (meleeRaw + (hasElemental ? eleRaw : 0));
    maxTotal += (meleeRaw + (hasElemental ? eleRaw : 0));

    minTotal *= newAtkMult;
    maxTotal *= newAtkMult;

    return Math.max((minTotal + maxTotal) / 2, 0);
}

// Returns poison DPS.
export const calcPoisonDamage = (ids: IDs): number => {
    return Math.max(getIDMax(ids, "poison") / 3, 0);
}

// Returns the mana saved per spell cycle.
export const calcManaSustain = (ids: IDs, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number]): number => {
    // TODO: make it so it doesnt assume slowest attack speed
    // TODO: add melee into spell cycle
    // TODO: fix hybrid/stealing functionality to include delayed clicks in spell cycle
    const spellCycleClicks = spellCycle.length * 3;
    const spellCycleLength = spellCycleClicks / cps; // Length of entire spell cycle in seconds

    const manaRegenPerSecond = getIDMax(ids, "manaRegen") / 5;
    const manaStealPerSecond = steals ? getIDMax(ids, "manaSteal") / 3 : 0;

    const firstSaved = (-1 * getIDMax(ids, "raw1stSpellCost") * (spellCycle.match(/1/g)||[]).length);
    const firstSavedPct = (-1 * Math.max(getIDMax(ids, "1stSpellCost"), -100) / 100 * (costs[0] + getIDMax(ids, "raw1stSpellCost")) * (spellCycle.match(/1/g)||[]).length);
    const secondSaved = (-1 * getIDMax(ids, "raw2ndSpellCost") * (spellCycle.match(/2/g)||[]).length);
    const secondSavedPct = (-1 * Math.max(getIDMax(ids, "2ndSpellCost"), -100) / 100 * (costs[1] + getIDMax(ids, "raw2ndSpellCost")) * (spellCycle.match(/2/g)||[]).length);
    const thirdSaved = (-1 * getIDMax(ids, "raw3rdSpellCost") * (spellCycle.match(/3/g)||[]).length);
    const thirdSavedPct = (-1 * Math.max(getIDMax(ids, "3rdSpellCost"), -100) / 100 * (costs[2] + getIDMax(ids, "raw3rdSpellCost")) * (spellCycle.match(/3/g)||[]).length);
    const fourthSaved = (-1 * getIDMax(ids, "raw4thSpellCost") * (spellCycle.match(/4/g)||[]).length);
    const fourthSavedPct = (-1 * Math.max(getIDMax(ids, "4thSpellCost"), -100) / 100 * (costs[3] + getIDMax(ids, "raw4thSpellCost")) * (spellCycle.match(/4/g)||[]).length);
    return manaRegenPerSecond + manaStealPerSecond + ((firstSaved + firstSavedPct + secondSaved + secondSavedPct + thirdSaved + thirdSavedPct + fourthSaved + fourthSavedPct) / spellCycleLength);
}

export const calcLifeSustain = (ids: IDs, steals: boolean): number => {
    const rawRegen = getIDMax(ids, "healthRegenRaw");
    const pctRegen = getIDMax(ids, "healthRegen") / 100;
    const totalRegen = rawRegen >= 0 ? rawRegen * (1 + pctRegen) : rawRegen * (Math.max(1 - pctRegen, 0));
    const steal = steals ? getIDMax(ids, "lifeSteal") / 3 : 0
    return totalRegen + steal;
}

const accumulateIDs = (weaponIDs: IDs, gearIDs: IDs): IDs => {
    let newIDs = structuredClone(weaponIDs);
    let key: keyof IDs;
    for (key in gearIDs) {
        if (key in newIDs) {
            let existingID = newIDs[key];
            if (typeof existingID !== "number") {
                existingID = existingID['max']
            }

            let newID = gearIDs[key];
            if (typeof newID !== "number") {
                newID = newID['max']
            }

            newIDs[key] = existingID + newID;
        }
        else {
            newIDs[key] = gearIDs[key];
        }
    }
    return newIDs;
}

export const getSpellIndex = (damage: Damage, weaponIDs: IDs, accumulatedIDs: IDs): [number] => {
    return [calcSpellDamage(damage, accumulatedIDs) - calcSpellDamage(damage, weaponIDs)];
}

export const getMeleeIndex = (damage: Damage, weaponIDs: IDs, gearIDs: IDs, accumulatedIDs: IDs): [number, string] => {
    const extraTiers = getIDMax(gearIDs, "rawAttackSpeed");
    let note = "";
    if (extraTiers > 0) {
        note = "ts";
    }
    else if (extraTiers < 0) {
        note = "td";
    }
    return [calcMeleeDamage(damage, accumulatedIDs) - calcMeleeDamage(damage, weaponIDs), note];
}

export const getPoisonIndex = (weaponIDs: IDs, gearIDs: IDs, accumulatedIDs: IDs): [number, string] => {
    const poisonID = getIDMax(gearIDs, "poison");
    return [calcPoisonDamage(accumulatedIDs) - calcPoisonDamage(weaponIDs), poisonID < 0 ? "neg" : ""];
}

export const getManaIndex = (weaponIDs: IDs, gearIDs: IDs,  accumulatedIDs: IDs, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number]): [number, string] => {
    const [pct1, pct2, pct3, pct4] = [getIDMax(gearIDs, "1stSpellCost"), getIDMax(gearIDs, "2ndSpellCost"), getIDMax(gearIDs, "3rdSpellCost"), getIDMax(gearIDs, "4thSpellCost"),]
    return [
        calcManaSustain(accumulatedIDs, steals, cps, spellCycle, costs) - calcManaSustain(weaponIDs, steals, cps, spellCycle, costs), 
        pct1 !== 0 || pct2 !== 0 || pct3 !== 0 || pct4 !== 0 ? "pct" : ""
    ];
}

export const getSPIndex = (gearIDs: IDs, sp: [boolean, boolean, boolean, boolean, boolean]): [number, string] => {
    const str = sp[0] ? 0 : getIDMax(gearIDs, "rawStrength");
    const dex = sp[1] ? 0 : getIDMax(gearIDs, "rawDexterity");
    const int = sp[2] ? 0 : getIDMax(gearIDs, "rawIntelligence");
    const def = sp[3] ? 0 : getIDMax(gearIDs, "rawDefence");
    const agi = sp[4] ? 0 : getIDMax(gearIDs, "rawAgility");
    const warning = (str < 0) || (dex < 0) || (int < 0) || (def < 0) || (agi < 0);
    return [str + dex + int + def + agi, warning ? "neg" : ""];
}

export const getHealthIndex = (gear: Item, gearIDs: IDs): [number, string] => {
    let baseHP = 0;
    if (gear !== undefined && 'base' in gear) {
        if (gear['base'] !== undefined && 'health' in gear['base']) {
            baseHP = Number(gear['base']['health']);
        }
    }
    const extraHP = getIDMax(gearIDs, 'rawHealth');
    return [baseHP + extraHP, extraHP !== 0 ? "rol" : ""];
}

export const getLifeIndex = (weaponIDs: IDs, gearIDs: IDs, accumulatedIDs: IDs, steals: boolean): [number, string] => {
    const hrID = getIDMax(gearIDs, "healthRegen");
    return [calcLifeSustain(accumulatedIDs, steals) - calcLifeSustain(weaponIDs, steals), hrID !== 0 ? "pct" : ""]
}

export const getWalkIndex = (gearIDs: IDs): [number] => {
    return [getIDMax(gearIDs, "walkSpeed")];
}

export const getIndices = (weapon: Item, powdering: string, gearName: string, gear: Item, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number], sp: [boolean, boolean, boolean, boolean, boolean]): Indices => {
    const baseDamage: Damage = getDamages(weapon);
    const powdersToApply: Powder[] = compressPowders(powdering);
    const powderedDamage: Damage = applyPowders(baseDamage, powdersToApply);
    const weaponIDs: IDs = weapon['identifications'] ? weapon['identifications'] : {};
    const gearIDs: IDs = gear['identifications'] ? gear['identifications'] : {};
    const accumulatedIDs: IDs = accumulateIDs(weaponIDs, gearIDs ? gearIDs : {});

    return {
        level: gear['requirements']['level'],
        name: gearName,
        rarity: gear['tier'],
        spell: getSpellIndex(powderedDamage, weaponIDs, accumulatedIDs),
        melee: getMeleeIndex(powderedDamage, weaponIDs, gearIDs, accumulatedIDs),
        poison: getPoisonIndex(weaponIDs, gearIDs, accumulatedIDs),
        mana: getManaIndex(weaponIDs, gearIDs, accumulatedIDs, steals, cps, spellCycle, costs),
        skillPoints: getSPIndex(gearIDs, sp),
        health: getHealthIndex(gear, gearIDs),
        life: getLifeIndex(weaponIDs, gearIDs, accumulatedIDs, steals),
        walkspeed: getWalkIndex(gearIDs),
    };
}
