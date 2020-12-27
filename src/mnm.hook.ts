import React from 'react';

import { IMnMContext } from './types';
import { MnMContext } from './mnm.context';

const useMnM = (): IMnMContext => {
  const context = React.useContext(MnMContext);

  return context;
};

export default useMnM;
