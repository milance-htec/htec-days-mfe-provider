import { useEffect } from 'react';
import useReefCloud from '../reef-cloud.hook';

export default function LogOutCallback() {
  const { logout } = useReefCloud();

  useEffect(() => {
    logout();
    window.location.href = '/';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
