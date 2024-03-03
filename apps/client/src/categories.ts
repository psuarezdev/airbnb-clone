import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';

const categories = [
  {
    label: 'Beach',
    icon: TbBeach,
    description: 'This property is near the beach!'
  },
  {
    label: 'Windmills',
    icon: GiWindmill,
    description: 'This property has windmills!'
  },
  {
    label: 'Modern',
    icon: MdOutlineVilla,
    description: 'This property is modern!'
  },
  {
    label: 'Countryside',
    icon: TbMountain,
    description: 'This property is in the countryside!'
  },
  {
    label: 'Pools',
    icon: TbPool,
    description: 'This property has a pool!'
  },
  {
    label: 'Islands',
    icon: GiIsland,
    description: 'This property is on an island!'
  },
  {
    label: 'Lake',
    icon: GiBoatFishing,
    description: 'This property is near a lake!'
  },
  {
    label: 'Skiing',
    icon: FaSkiing,
    description: 'This property has skiing activities!'
  },
  {
    label: 'Castles',
    icon: GiCastle,
    description: 'This property is in a castle!'
  },
  {
    label: 'Camping',
    icon: GiForestCamp,
    description: 'This property is has camping activities!'
  },
  {
    label: 'Artic',
    icon: BsSnow,
    description: 'This property is in the artic!'
  },
  {
    label: 'Cave',
    icon: GiCaveEntrance,
    description: 'This property is in a cave!'
  },
  {
    label: 'Desert',
    icon: GiCactus,
    description: 'This property is in the desert!'
  },
  {
    label: 'Barns',
    icon: GiBarn,
    description: 'This property is in a barn!'
  },
  {
    label: 'Luxury',
    icon: IoDiamond,
    description: 'This property is luxurious!'
  },
];

export default categories;