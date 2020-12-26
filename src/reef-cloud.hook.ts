import React from 'react';

import { IReefCloudContext } from './types';
import { ReefCloudContext } from './reef-cloud.context';

const useReefCloud = (): IReefCloudContext => {
  const context = React.useContext(ReefCloudContext);

  return context;
};

export default useReefCloud;
