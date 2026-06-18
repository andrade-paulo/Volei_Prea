/** Grade principal: colunas compartilhadas pelo cabeçalho e pelas linhas via subgrid. */
export const playersTable =
  "grid w-full grid-cols-[minmax(0,2fr)_minmax(2rem,0.55fr)_minmax(2rem,0.55fr)_minmax(2.25rem,0.7fr)_minmax(2.25rem,0.7fr)_minmax(2.25rem,0.7fr)_minmax(1.75rem,0.5fr)_minmax(4.25rem,auto)] gap-x-1 gap-y-1.5 sm:gap-x-2 sm:gap-y-2";

export const matchesTable =
  "grid w-full grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(3rem,0.8fr)_minmax(3rem,0.8fr)_minmax(2.5rem,auto)] gap-x-2 gap-y-1.5 sm:gap-y-2";

export const historyTableRow =
  "col-span-full grid grid-cols-subgrid items-center";

export const historyPlayersDataStrip =
  "col-span-7 col-start-1 grid grid-cols-subgrid items-center border border-black bg-[#b0b0b0] py-2 sm:py-3";

export const historyMatchesDataStrip =
  "col-span-4 col-start-1 grid grid-cols-subgrid items-center border border-black bg-[#b0b0b0] py-2 sm:py-3";

export const historyHeaderCell = "text-center";

export const historyDataCell = "text-center text-[#1a1a1a]";

export const historyNameCell = "truncate text-center text-[#1a1a1a]";

export const historyPlayersActionsCell =
  "col-start-8 flex flex-row items-center justify-center gap-1";

export const historyMatchesActionsCell =
  "col-start-5 flex flex-row items-center justify-center gap-1";
