export const POWDERS: {
    [key: string]: Powder
} = {
    "e1": {damages: {'inc_min': 3, 'inc_max': 6}, conversion: 0.17, element: 'earth'},
    "e2": {damages: {'inc_min': 5, 'inc_max': 8}, conversion: 0.21, element: 'earth'},
    "e3": {damages: {'inc_min': 6, 'inc_max': 10}, conversion: 0.25, element: 'earth'},
    "e4": {damages: {'inc_min': 7, 'inc_max': 10}, conversion: 0.31, element: 'earth'},
    "e5": {damages: {'inc_min': 9, 'inc_max': 11}, conversion: 0.38, element: 'earth'},
    "e6": {damages: {'inc_min': 11, 'inc_max': 13}, conversion: 0.46, element: 'earth'},
    "t1": {damages: {'inc_min': 1, 'inc_max': 8}, conversion: 0.09, element: 'thunder'},
    "t2": {damages: {'inc_min': 1, 'inc_max': 12}, conversion: 0.11, element: 'thunder'},
    "t3": {damages: {'inc_min': 2, 'inc_max': 15}, conversion: 0.13, element: 'thunder'},
    "t4": {damages: {'inc_min': 3, 'inc_max': 15}, conversion: 0.17, element: 'thunder'},
    "t5": {damages: {'inc_min': 4, 'inc_max': 17}, conversion: 0.22, element: 'thunder'},
    "t6": {damages: {'inc_min': 5, 'inc_max': 20}, conversion: 0.28, element: 'thunder'},
    "w1": {damages: {'inc_min': 3, 'inc_max': 4}, conversion: 0.09, element: 'water'},
    "w2": {damages: {'inc_min': 4, 'inc_max': 6}, conversion: 0.13, element: 'water'},
    "w3": {damages: {'inc_min': 5, 'inc_max': 8}, conversion: 0.15, element: 'water'},
    "w4": {damages: {'inc_min': 6, 'inc_max': 8}, conversion: 0.21, element: 'water'},
    "w5": {damages: {'inc_min': 7, 'inc_max': 10}, conversion: 0.26, element: 'water'},
    "w6": {damages: {'inc_min': 9, 'inc_max': 11}, conversion: 0.32, element: 'water'},
    "f1": {damages: {'inc_min': 2, 'inc_max': 5}, conversion: 0.14, element: 'fire'},
    "f2": {damages: {'inc_min': 4, 'inc_max': 8}, conversion: 0.16, element: 'fire'},
    "f3": {damages: {'inc_min': 5, 'inc_max': 9}, conversion: 0.19, element: 'fire'},
    "f4": {damages: {'inc_min': 6, 'inc_max': 9}, conversion: 0.24, element: 'fire'},
    "f5": {damages: {'inc_min': 8, 'inc_max': 10}, conversion: 0.30, element: 'fire'},
    "f6": {damages: {'inc_min': 10, 'inc_max': 12}, conversion: 0.37, element: 'fire'},
    "a1": {damages: {'inc_min': 2, 'inc_max': 6}, conversion: 0.11, element: 'air'},
    "a2": {damages: {'inc_min': 3, 'inc_max': 10}, conversion: 0.14, element: 'air'},
    "a3": {damages: {'inc_min': 4, 'inc_max': 11}, conversion: 0.17, element: 'air'},
    "a4": {damages: {'inc_min': 5, 'inc_max': 11}, conversion: 0.22, element: 'air'},
    "a5": {damages: {'inc_min': 7, 'inc_max': 12}, conversion: 0.28, element: 'air'},
    "a6": {damages: {'inc_min': 8, 'inc_max': 14}, conversion: 0.35, element: 'air'}
}

export type Powder = {
    damages: {
        inc_min: number,
        inc_max: number
    },
    conversion: number,
    element: Elemental
}

type Elemental = 'earth' | 'thunder' | 'water' | 'fire' | 'air'

export const ATK_MULTIPLIERS: {
    [key: string]: number
} = {
    "super_slow": 0.51,
    "very_slow": 0.83,
    "slow": 1.5,
    "normal": 2.05,
    "fast": 2.5,
    "very_fast": 3.1,
    "super_fast": 4.3
}

export const SPELL_COSTS = {
    'bow': {
        '1': 35,
        '2': 20,
        '3': 45,
        '4': 30
    },
    'spear': {
        '1': 40,
        '2': 25,
        '3': 40,
        '4': 30
    },
    'relik': {
        '1': 30,
        '2': 15,
        '3': 40,
        '4': 30
    },
    'wand': {
        '1': 35,
        '2': 25,
        '3': 50,
        '4': 30
    },
    'dagger': {
        '1': 40,
        '2': 20,
        '3': 40,
        '4': 35
    }
}
