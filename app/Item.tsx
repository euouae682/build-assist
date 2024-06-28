type ItemProps = {
    level: number,
    name: string,
    rarity: string,
    spell: number,
    melee: number,
    poison: number,
    mana: number,
    life: number
}

export default function Item(props: ItemProps) {
    const getRarityColor = (rarity: string): string => {
        if (rarity === "set") {
            return '#09eb0d'
        }
        else if (rarity === "unique") {
            return '#ccbc06'
        }
        else if (rarity === "rare") {
            return '#ff0fff'
        }
        else if (rarity === "legendary") {
            return '#0fbfff'
        }
        else if (rarity === "fabled") {
            return '#ff0f0f'
        }
        else if (rarity === "mythic") {
            return '#bb0fff'
        }
        else {
            return 'black'
        }
    }

    return (
      <div className="m-2 flex">
        <p style={{color: getRarityColor(props.rarity)}} className="w-64">Lv. {props.level} { props.name }</p>
        <p className="w-32">{ props.spell }</p>
        <p className="w-32">{ props.melee }</p>
        <p className="w-32">{ props.poison }</p>
        <p className="w-32">{ props.mana }</p>
        <p className="w-32">{ props.life }</p>
      </div>
    );
  }
  