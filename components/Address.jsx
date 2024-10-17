import { useTonAddress } from '@tonconnect/ui-react';
import { FaWallet } from "react-icons/fa";

const TAddress = () => {
    const userFriendlyAddress = useTonAddress();
    const formatAddress = (address) => {
      
      if (!address) return '';
  
      const start = address.slice(0, 4);
      const end = address.slice(-4);
      return `${start}...${end}`;
    };
  
    return (
      userFriendlyAddress && (
        <span className="bg-zinc-900/50 px-2 py-1 rounded-lg text-sm flex justify-center items-center gap-1"><FaWallet /> {formatAddress(userFriendlyAddress)}</span>
      )
    );
  };
  
  export default TAddress