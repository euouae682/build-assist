import { POWDERS, ATK_MULTIPLIERS, Powder } from "./constants";
import { WynnItem, Damage, IDs, Indices } from "./itemTypes";

// Get the base damages/base attack speed of a weapon
const getDamages = (weapon: WynnItem): Damage => {
    const base = weapon['base']
    if (base) {
        return {
            baseAtkMult: ATK_MULTIPLIERS[weapon["attackSpeed"]],
            damages: {
                neutral: 'baseDamage' in base && typeof base['baseDamage'] !== "number" ? base['baseDamage'] : {'min': 0, 'max': 0},
                earth: 'baseEarthDamage' in base && typeof base['baseEarthDamage'] !== "number" ? base['baseEarthDamage'] : {'min': 0, 'max': 0},
                thunder: 'baseThunderDamage' in base && typeof base['baseThunderDamage'] !== "number" ? base['baseThunderDamage'] : {'min': 0, 'max': 0},
                water: 'baseWaterDamage' in base && typeof base['baseWaterDamage'] !== "number" ? base['baseWaterDamage'] : {'min': 0, 'max': 0},
                fire: 'baseFireDamage' in base && typeof base['baseFireDamage'] !== "number" ? base['baseFireDamage'] : {'min': 0, 'max': 0},
                air: 'baseAirDamage' in base && typeof base['baseAirDamage'] !== "number" ? base['baseAirDamage'] : {'min': 0, 'max': 0}
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
    const spellPct = getIDMax(ids, "damage") / 100 + getIDMax(ids, "spellDamage") / 100;
    const spellRaw = getIDMax(ids, "rawDamage") + getIDMax(ids, "rawSpellDamage");

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

        if (key === "neutral" && damage['damages']['neutral']['max'] != 0) {
            totalMod += nPct;
            totalRawMod += nRaw;
        }
        else {
            hasElemental = true;
            totalMod += elePct;
            if (key === "earth" && damage['damages']['earth']['max'] != 0) {
                totalMod += ePct;
                totalRawMod += eRaw;
            }
            else if (key === "thunder" && damage['damages']['thunder']['max'] != 0) {
                totalMod += tPct;
                totalRawMod += tRaw;
            }
            else if (key === "water" && damage['damages']['water']['max'] != 0) {
                totalMod += wPct;
                totalRawMod += wRaw;
            }
            else if (key === "fire" && damage['damages']['fire']['max'] != 0) {
                totalMod += fPct;
                totalRawMod += fRaw;
            }
            else if (key === "air" && damage['damages']['air']['max'] != 0) {
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
    const meleePct = getIDMax(ids, "damage") / 100 + getIDMax(ids, "mainAttackDamage") / 100;
    const meleeRaw = getIDMax(ids, "rawDamage") + getIDMax(ids, "rawMainAttackDamage");

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

        if (key === "neutral" && damage['damages']['neutral']['max'] != 0) {
            totalMod += nPct;
            totalRawMod += nRaw;
        }
        else {
            hasElemental = true;
            totalMod += elePct;
            if (key === "earth" && damage['damages']['earth']['max'] != 0) {
                totalMod += ePct;
                totalRawMod += eRaw;
            }
            else if (key === "thunder" && damage['damages']['thunder']['max'] != 0) {
                totalMod += tPct;
                totalRawMod += tRaw;
            }
            else if (key === "water" && damage['damages']['water']['max'] != 0) {
                totalMod += wPct;
                totalRawMod += wRaw;
            }
            else if (key === "fire" && damage['damages']['fire']['max'] != 0) {
                totalMod += fPct;
                totalRawMod += fRaw;
            }
            else if (key === "air" && damage['damages']['air']['max'] != 0) {
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

export const getSpellIndex = (damage: Damage, weaponIDs: IDs, accumulatedIDs: IDs): number => {
    return calcSpellDamage(damage, accumulatedIDs) - calcSpellDamage(damage, weaponIDs);
}

export const getMeleeIndex = (damage: Damage, weaponIDs: IDs, gearIDs: IDs, accumulatedIDs: IDs): number => {
    return calcMeleeDamage(damage, accumulatedIDs) - calcMeleeDamage(damage, weaponIDs);
}

export const getManaIndex = (weaponIDs: IDs, gearIDs: IDs,  accumulatedIDs: IDs, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number]): number => {
    return calcManaSustain(accumulatedIDs, steals, cps, spellCycle, costs) - calcManaSustain(weaponIDs, steals, cps, spellCycle, costs);
}

export const getSPIndex = (gearIDs: IDs, sp: [boolean, boolean, boolean, boolean, boolean]): number => {
    const str = sp[0] ? 0 : getIDMax(gearIDs, "rawStrength");
    const dex = sp[1] ? 0 : getIDMax(gearIDs, "rawDexterity");
    const int = sp[2] ? 0 : getIDMax(gearIDs, "rawIntelligence");
    const def = sp[3] ? 0 : getIDMax(gearIDs, "rawDefence");
    const agi = sp[4] ? 0 : getIDMax(gearIDs, "rawAgility");
    return str + dex + int + def + agi;
}

export const getHealthIndex = (gear: WynnItem, gearIDs: IDs): number => {
    let baseHP = 0;
    if (gear["base"] && "baseHealth" in gear["base"] && typeof gear["base"]["baseHealth"] == "number") {
        baseHP = gear["base"]["baseHealth"];
    }
    const extraHP = getIDMax(gearIDs, 'rawHealth');
    return baseHP + extraHP;
}

export const getLifeIndex = (weaponIDs: IDs, gearIDs: IDs, accumulatedIDs: IDs, steals: boolean): number => {
    return calcLifeSustain(accumulatedIDs, steals) - calcLifeSustain(weaponIDs, steals);
}

export const getGeneralDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    if ("requirements" in gear) {
        const requirements = gear['requirements'];
        if ("strength" in requirements) {
            details.push("Str Req: " + requirements['strength']);
        }
        if ("dexterity" in requirements) {
            details.push("Dex Req: " + requirements['dexterity']);
        }
        if ("intelligence" in requirements) {
            details.push("Int Req: " + requirements['intelligence']);
        }
        if ("defence" in requirements) {
            details.push("Def Req: " + requirements['defence']);
        }
        if ("agility" in requirements) {
            details.push("Agi Req: " + requirements['agility']);
        }
        if ("quest" in requirements) {
            details.push("Quest: " + requirements['quest']);
        }
    }
    if ("powderSlots" in gear) {
        details.push("Slots: " + gear['powderSlots']);
    }
    if (gear['majorIds']) {
        details.push("Major ID: " + Object.keys(gear['majorIds'])[0]);
    }
    return details;
}

export const getBaseDPSDetails = (baseDps: number, gear: WynnItem): string[] => {
    let details: string[] = [];
    if ('weaponType' in gear) {
        details.push("Base Atk: " + gear["attackSpeed"]);
        details.push("Per Hit: " + (baseDps / ATK_MULTIPLIERS[gear["attackSpeed"]]).toFixed(2));
    }
    return details;
}

const getPhrase = (gearIDs: IDs, name: string, displayName: string, isDamage: boolean): string => {
    let pctVal = 0;
    let rawVal = 0;
    if (name in gearIDs) {
        pctVal = getIDMax(gearIDs, name);
    }
    if ("raw" + name.charAt(0).toUpperCase() + name.slice(1) in gearIDs) {
        rawVal = getIDMax(gearIDs, "raw" + name.charAt(0).toUpperCase() + name.slice(1));
    }
    else if (name == "healthRegen" && name + "Raw" in gearIDs) {
        rawVal = getIDMax(gearIDs, name + "Raw");
    }

    if (pctVal != 0 && rawVal != 0) {
        return displayName + ": " + (isDamage ? pctVal + "%, " + rawVal : rawVal + ", " + pctVal + "%");
    }
    else if (pctVal != 0) {
        return displayName + ": " + pctVal + "%";
    }
    else if (rawVal != 0) {
        return displayName + ": " + rawVal;
    }
    return "";
}

export const getSpellDetails = (gear: WynnItem): string[] => {
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    let details = [
        getPhrase(gearIDs, "damage", "Damage", true),
        getPhrase(gearIDs, "spellDamage", "Spell", true),
        getPhrase(gearIDs, "neutralDamage", "Neutral", true),
        getPhrase(gearIDs, "neutralSpellDamage", "Neut. Spell", true),
        getPhrase(gearIDs, "elementalDamage", "Elemental", true),
        getPhrase(gearIDs, "elementalSpellDamage", "Elemt. Spell", true),
        getPhrase(gearIDs, "earthDamage", "Earth", true),
        getPhrase(gearIDs, "earthSpellDamage", "Earth Spell", true),
        getPhrase(gearIDs, "thunderDamage", "Thunder", true),
        getPhrase(gearIDs, "thunderSpellDamage", "Thunder Spell", true),
        getPhrase(gearIDs, "waterDamage", "Water", true),
        getPhrase(gearIDs, "waterSpellDamage", "Water Spell", true),
        getPhrase(gearIDs, "fireDamage", "Fire", true),
        getPhrase(gearIDs, "fireSpellDamage", "Fire Spell", true),
        getPhrase(gearIDs, "airDamage", "Air", true),
        getPhrase(gearIDs, "airSpellDamage", "Air Spell", true)
    ]
    details.filter((phrase) => phrase != "");
    return details;
}

export const getMeleeDetails = (gear: WynnItem): string[] => {
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    let details = [
        getPhrase(gearIDs, "damage", "Damage", true),
        getPhrase(gearIDs, "mainAttackDamage", "Melee", true),
        getPhrase(gearIDs, "neutralDamage", "Neutral", true),
        getPhrase(gearIDs, "neutralMainAttackDamage", "Neut. Melee", true),
        getPhrase(gearIDs, "elementalDamage", "Elemental", true),
        getPhrase(gearIDs, "elementalMainAttackDamage", "Elemt. Melee", true),
        getPhrase(gearIDs, "earthDamage", "Earth", true),
        getPhrase(gearIDs, "earthMainAttackDamage", "Earth Melee", true),
        getPhrase(gearIDs, "thunderDamage", "Thunder", true),
        getPhrase(gearIDs, "thunderMainAttackDamage", "Thunder Melee", true),
        getPhrase(gearIDs, "waterDamage", "Water", true),
        getPhrase(gearIDs, "waterMainAttackDamage", "Water Melee", true),
        getPhrase(gearIDs, "fireDamage", "Fire", true),
        getPhrase(gearIDs, "fireMainAttackDamage", "Fire Melee", true),
        getPhrase(gearIDs, "airDamage", "Air", true),
        getPhrase(gearIDs, "airMainAttackDamage", "Air Melee", true)
    ]
    details.filter((phrase) => phrase != "");
    if ("rawAttackSpeed" in gearIDs) {
        details.push("Atk Speed: " + getIDMax(gearIDs, 'rawAttackSpeed'));
    }
    return details;
}

export const getManaDetails = (gear: WynnItem): string[] => {
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    let details = [
        getPhrase(gearIDs, "1stSpellCost", "1st Cost", false),
        getPhrase(gearIDs, "2ndSpellCost", "2nd Cost", false),
        getPhrase(gearIDs, "3rdSpellCost", "3rd Cost", false),
        getPhrase(gearIDs, "4thSpellCost", "4th Cost", false),
    ]
    details.filter((phrase) => phrase != "");
    if ("manaRegen" in gearIDs) {
        details.push("Mana Regen: " + getIDMax(gearIDs, 'manaRegen') + "/5s");
    }
    if ("manaSteal" in gearIDs) {
        details.push("Mana Steal: " + getIDMax(gearIDs, 'manaSteal') + "/3s");
    }
    return details;
}

export const getSkillPointDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    if ("rawStrength" in gearIDs) {
        details.push("Str: " + gearIDs['rawStrength']);
    }
    if ("rawDexterity" in gearIDs) {
        details.push("Dex: " + gearIDs['rawDexterity']);
    }
    if ("rawIntelligence" in gearIDs) {
        details.push("Int: " + gearIDs['rawIntelligence']);
    }
    if ("rawDefence" in gearIDs) {
        details.push("Def: " + gearIDs['rawDefence']);
    }
    if ("rawAgility" in gearIDs) {
        details.push("Agi: " + gearIDs['rawAgility']);
    }
    return details;
}

const getDefPhrase = (gear: WynnItem, gearIDs: IDs, name: string, displayName: string): string => {
    let rawVal = 0;
    let pctVal = 0;
    const baseString = "base" + name.charAt(0).toUpperCase() + name.slice(1);
    if ("base" in gear && gear["base"] && baseString in gear["base"] && typeof gear["base"][baseString] == "number") {
        rawVal = gear["base"][baseString];
    }
    if (name in gearIDs) {
        pctVal = getIDMax(gearIDs, name);
    }

    if (pctVal != 0 && rawVal != 0) {
        return displayName + ": " + rawVal + ", " + pctVal + "%";
    }
    else if (pctVal != 0) {
        return displayName + ": " + pctVal + "%";
    }
    else if (rawVal != 0) {
        return displayName + ": " + rawVal;
    }
    return "";
}

export const getHealthDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    if (gear["base"] && "baseHealth" in gear["base"] && typeof gear["base"]["baseHealth"] == "number") {
        details.push("Base HP: " + gear["base"]["baseHealth"]);
    }
    if ("rawHealth" in gearIDs) {
        details.push("Bonus HP: " + getIDMax(gearIDs, 'rawHealth'));
    }
    const defenses = [
        getDefPhrase(gear, gearIDs, "earthDefence", "Earth Def"),
        getDefPhrase(gear, gearIDs, "thunderDefence", "Thunder Def"),
        getDefPhrase(gear, gearIDs, "waterDefence", "Water Def"),
        getDefPhrase(gear, gearIDs, "fireDefence", "Fire Def"),
        getDefPhrase(gear, gearIDs, "airDefence", "Air Def")
    ]
    defenses.map((phrase) => {
        if (phrase != "") {
            details.push(phrase);
        }
    })
    if ("elementalDefence" in gearIDs) {
        details.push("Elemt. Def: " + getIDMax(gearIDs, 'elementalDefence') + "%");
    }
    return details;
}

export const getLifeDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    const hpr = getPhrase(gearIDs, "healthRegen", "HP Regen", false);
    if (hpr != "") {
        details.push(hpr);
    }
    if ("lifeSteal" in gearIDs) {
        details.push("Life Steal: " + getIDMax(gearIDs, 'lifeSteal') + "/3s");
    }
    return details;
}

export const getOtherDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    if ("poison" in gearIDs) {
        details.push("Poison: " + getIDMax(gearIDs, 'poison') + "/3s");
    }
    if ("walkSpeed" in gearIDs) {
        details.push("Walkspeed: " + getIDMax(gearIDs, 'walkSpeed') + "%");
    }
    if ("jumpHeight" in gearIDs) {
        details.push("Jump Height: " + getIDMax(gearIDs, 'jumpHeight'));
    }
    if ("healingEfficiency" in gearIDs) {
        details.push("Healing: " + getIDMax(gearIDs, 'healingEfficiency') + "%");
    }
    if ("knockback" in gearIDs) {
        details.push("Knockback: " + getIDMax(gearIDs, 'knockback') + "%");
    }
    if ("slowEnemy" in gearIDs) {
        details.push("Slow: " + getIDMax(gearIDs, 'slowEnemy') + "%");
    }
    if ("weakenEnemy" in gearIDs) {
        details.push("Weaken: " + getIDMax(gearIDs, 'weakenEnemy') + "%");
    }
    if ("xpBonus" in gearIDs) {
        details.push("XP Bonus: " + getIDMax(gearIDs, 'xpBonus') + "%");
    }
    if ("lootBonus" in gearIDs) {
        details.push("Loot Bonus: " + getIDMax(gearIDs, 'lootBonus') + "%");
    }
    return details;
}

export const getMinorDetails = (gear: WynnItem): string[] => {
    let details: string[] = [];
    let gearIDs: IDs = {};
    if ("identifications" in gear) {
        gearIDs = gear['identifications'];
    }
    if ("thorns" in gearIDs) {
        details.push("Thorns: " + getIDMax(gearIDs, 'thorns') + "%");
    }
    if ("reflection" in gearIDs) {
        details.push("Reflection: " + getIDMax(gearIDs, 'reflection') + "%");
    }
    if ("exploding" in gearIDs) {
        details.push("Exploding: " + getIDMax(gearIDs, 'exploding') + "%");
    }
    if ("stealing" in gearIDs) {
        details.push("Stealing: " + getIDMax(gearIDs, 'stealing') + "%");
    }
    if ("sprint" in gearIDs) {
        details.push("Sprint: " + getIDMax(gearIDs, 'sprint') + "%");
    }
    if ("sprintRegen" in gearIDs) {
        details.push("Sprint Regen: " + getIDMax(gearIDs, 'sprintRegen') + "%");
    }
    return details;
}

export const getItemDetails = (baseDps: number, gear: WynnItem): string[][] => {
    return [
        getGeneralDetails(gear), 
        getBaseDPSDetails(baseDps, gear),
        getSpellDetails(gear), 
        getMeleeDetails(gear), 
        getManaDetails(gear), 
        getSkillPointDetails(gear), 
        getHealthDetails(gear), 
        getLifeDetails(gear), 
        getOtherDetails(gear), 
        getMinorDetails(gear)
    ];
}

export const getIndices = (weapon: WynnItem, powdering: string, gearName: string, gear: WynnItem, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number], sp: [boolean, boolean, boolean, boolean, boolean]): Indices => {
    const baseDamage: Damage = getDamages(weapon);
    const powdersToApply: Powder[] = compressPowders(powdering);
    const powderedDamage: Damage = applyPowders(baseDamage, powdersToApply);
    const weaponIDs: IDs = weapon['identifications'] ? weapon['identifications'] : {};
    const gearIDs: IDs = gear['identifications'] ? gear['identifications'] : {};
    const accumulatedIDs: IDs = accumulateIDs(weaponIDs, gearIDs ? gearIDs : {});
    const gearDetails: string[][] = getItemDetails(getBaseDPS(powderedDamage), gear);

    return {
        general: {
            name: gearName,
            level: gear['requirements']['level'],
            rarity: gear['rarity'],
            details: gearDetails[0]
        },
        spell: {
            value: getSpellIndex(powderedDamage, weaponIDs, accumulatedIDs),
            details: gearDetails[2]
        },
        melee: {
            value: getMeleeIndex(powderedDamage, weaponIDs, gearIDs, accumulatedIDs),
            details: gearDetails[3]
        },
        mana: {
            value: getManaIndex(weaponIDs, gearIDs, accumulatedIDs, steals, cps, spellCycle, costs),
            details: gearDetails[4]
        },
        skillPoints: {
            value: getSPIndex(gearIDs, sp),
            details: gearDetails[5]
        },
        health: {
            value: getHealthIndex(gear, gearIDs),
            details: gearDetails[6]
        },
        life: {
            value: getLifeIndex(weaponIDs, gearIDs, accumulatedIDs, steals),
            details: gearDetails[7]
        },
        other: {
            value: gearDetails[8].length,
            details: gearDetails[8]
        },
        minor: {
            value: gearDetails[9].length,
            details: gearDetails[9]
        }
    };
}

export const getWeaponIndices = (weaponName: string, weapon: WynnItem, powderTier: number, steals: boolean, cps: number, spellCycle: string, costs: [number, number, number, number], sp: [boolean, boolean, boolean, boolean, boolean]): Indices => {
    const baseDamage: Damage = getDamages(weapon);

    const powderSlots = 'powderSlots' in weapon ? weapon['powderSlots'] : 0;
    let powdering = ""
    if (powderTier === 0) {
        powdering = "";
    }
    else if (baseDamage['damages']['thunder']['max'] > 0) {
        powdering = `t${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }
    else if (baseDamage['damages']['earth']['max'] > 0) {
        powdering = `e${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }
    else if (baseDamage['damages']['air']['max'] > 0) {
        powdering = `a${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }
    else if (baseDamage['damages']['fire']['max'] > 0) {
        powdering = `f${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }
    else if (baseDamage['damages']['water']['max'] > 0) {
        powdering = `w${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }
    else {
        powdering = `t${powderTier}`.repeat(powderSlots ? powderSlots : 0);
    }

    const powdersToApply: Powder[] = compressPowders(powdering);
    const powderedDamage: Damage = applyPowders(baseDamage, powdersToApply);
    const weaponIDs: IDs = weapon['identifications'] ? weapon['identifications'] : {};
    const powderStr: string = powdering === "" ? "" : `[${powdering}]`
    const weaponDetails: string[][] = getItemDetails(getBaseDPS(powderedDamage), weapon);

    return {
        general: {
            name: weaponName + " " + powderStr,
            level: weapon['requirements']['level'],
            rarity: weapon['rarity'],
            details: weaponDetails[0]
        },
        baseDps: {
            value: getBaseDPS(powderedDamage),
            details: weaponDetails[1]
        },
        spell: {
            value: calcSpellDamage(powderedDamage, weaponIDs),
            details: weaponDetails[2]
        },
        melee: {
            value: calcMeleeDamage(powderedDamage, weaponIDs),
            details: weaponDetails[3]
        },
        mana: {
            value: calcManaSustain(weaponIDs, steals, cps, spellCycle, costs),
            details: weaponDetails[4]
        },
        skillPoints: {
            value: getSPIndex(weaponIDs, sp),
            details: weaponDetails[5]
        },
        health: {
            value: getIDMax(weaponIDs, 'rawHealth'),
            details: weaponDetails[6]
        },
        life: {
            value: calcLifeSustain(weaponIDs, steals),
            details: weaponDetails[7]
        },
        other: {
            value: weaponDetails[8].length,
            details: weaponDetails[8]
        },
        minor: {
            value: weaponDetails[9].length,
            details: weaponDetails[9]
        }
    };
}
