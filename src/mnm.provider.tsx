import React, { useEffect, useState } from 'react';

import { MnMContext } from './mnm.context';

type IMnMProviderProps = {
  children: React.ReactNode;
};

export default function MnMProvider({ children }: IMnMProviderProps) {
  const [itemList, setItemList] = useState<any | null>([]);

  return (
    <MnMContext.Provider
      value={{
        itemList,
        setItemList,
      }}
    >
      {children}
    </MnMContext.Provider>
  );
}
