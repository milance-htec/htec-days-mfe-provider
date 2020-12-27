import React from 'react';
import { IMnMContext } from './types';

export const MnMContext = React.createContext<IMnMContext>({
  itemList: [],
  setItemList: () => {},
});
