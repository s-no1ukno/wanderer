import { useCallback } from 'react';
import clsx from 'clsx';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Commands } from '@/hooks/Mapper/types/mapHandlers.ts';
import { CharacterTypeRaw } from '@/hooks/Mapper/types';
import { emitMapEvent } from '@/hooks/Mapper/events';
import { useMapRootState } from '@/hooks/Mapper/mapRootProvider';
import classes from './Characters.module.scss';
import { isDocked } from '@/hooks/Mapper/helpers/isDocked.ts';
import { PrimeIcons } from 'primereact/api';

interface CharactersProps {
  data: CharacterTypeRaw[];
}

export const Characters = ({ data }: CharactersProps) => {
  const [parent] = useAutoAnimate();

  const {
    data: { mainCharacterEveId, followingCharacterEveId },
  } = useMapRootState();

  const handleSelect = useCallback((character: CharacterTypeRaw) => {
    emitMapEvent({
      name: Commands.centerSystem,
      data: character?.location?.solar_system_id?.toString(),
    });
  }, []);

  const items = data.map(character => (
    <li
      key={character.eve_id}
      className="flex flex-col items-center justify-center"
      onClick={() => handleSelect(character)}
    >
      <div
        className={clsx(
          'overflow-hidden relative',
          'flex w-[35px] h-[35px] rounded-[4px] border-[1px] border-solid bg-transparent cursor-pointer',
          'transition-colors duration-250',
          {
            ['border-stone-800/90']: !character.online,
            ['border-lime-600/70']: character.online,
          },
        )}
        title={character.name}
      >
        {mainCharacterEveId === character.eve_id && (
          <span
            className={clsx(
              'absolute top-[2px] left-[22px] w-[9px] h-[9px]',
              'text-yellow-500 text-[9px] rounded-[1px] z-10',
              'pi',
              PrimeIcons.STAR_FILL,
            )}
          />
        )}
        {followingCharacterEveId === character.eve_id && (
          <span
            className={clsx(
              'absolute top-[23px] left-[22px] w-[10px] h-[10px]',
              'text-sky-300 text-[10px] rounded-[1px] z-10',
              'pi pi-angle-double-right',
            )}
          />
        )}
        {isDocked(character.location) && <div className={classes.Docked} />}
        <div
          className={clsx(
            'flex w-full h-full bg-transparent cursor-pointer',
            'bg-center bg-no-repeat bg-[length:100%]',
            'transition-opacity',
            'shadow-[inset_0_1px_6px_1px_#000000]',
            {
              ['opacity-60']: !character.online,
              ['opacity-100']: character.online,
            },
          )}
          style={{ backgroundImage: `url(https://images.evetech.net/characters/${character.eve_id}/portrait)` }}
        ></div>
      </div>
    </li>
  ));

  return (
    <ul className="flex gap-1 characters" id="characters" ref={parent}>
      {items}
    </ul>
  );
};
