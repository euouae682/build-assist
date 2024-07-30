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

export const SPELL_COSTS: {
    [key: string]: {
        [key: string]: [number, number, number, number]
    }
} = {
    'bow': {
        '0': [30, 15, 35, 25],
        '30': [25, 13, 29, 21],
        '60': [21, 11, 25, 18],
        '120': [17, 8, 19, 14],
    },
    'spear': {
        '0': [30, 20, 35, 25],
        '30': [25, 17, 29, 21],
        '60': [21, 14, 25, 18],
        '120': [17, 11, 19, 14],
    },
    'relik': {
        '0': [20, 10, 25, 35],
        '30': [17, 8, 21, 29],
        '60': [14, 7, 18, 25],
        '120': [11, 6, 14, 19],
    },
    'wand': {
        '0': [30, 20, 40, 25],
        '30': [25, 17, 34, 21],
        '60': [21, 14, 29, 18],
        '120': [17, 11, 22, 14],
    },
    'dagger': {
        '0': [30, 15, 35, 30],
        '30': [25, 13, 29, 25],
        '60': [21, 11, 25, 21],
        '120': [17, 8, 19, 17],
    }
}
