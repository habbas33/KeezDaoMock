import React, {useContext, useState,useEffect } from 'react'
import { MdNavigateNext, } from "react-icons/md";
import { AiOutlineUserAdd, AiFillDelete, AiOutlineUser, AiFillCheckCircle } from "react-icons/ai";
import { Input } from "../../components";
import {StyledTooltip} from '../../styles'
import {toast} from 'react-toastify';
import { CreateDaoContext } from '../../context/CreateDaoContext'
import { shortenAddress } from "../../utils/shortenAddress";
import { fetchErc725Data } from '../../services/erc725';

const CreateKeyPermissions = (props: {handleSubmitCreate:any}) => {
    const {handleSubmitCreate} = props;
    const {keyPermissions, setKeyPermissions} = useContext(CreateDaoContext);
    const [upAddress, setUpAddress] = useState<string>('');
    const [masterKeyPermission, setMasterKeyPermission] = useState<boolean>(false);
    const [hrKeyPermission, setHrKeyPermission] = useState<boolean>(false);
    const [votePermission, setVotePermission] = useState<boolean>(false);
    const [proposePermission, setProposePermission] = useState<boolean>(false);
    const [sendDelegatePermission, setSendDelegatePermission] = useState<boolean>(false);
    const [receiveDelegatePermission, setReceiveDelegatePermission] = useState<boolean>(false);

    const handleAddKeyPermission = (event: any) => {
      event.preventDefault();
      const validationResult = addKeyPermissionValidations();
      if (validationResult !== "success") {
          return toast.error(validationResult,
          {position: toast.POSITION.BOTTOM_RIGHT});
      }
      setKeyPermissions([...keyPermissions,{upAddress:upAddress, keyPermissions:{masterKey:masterKeyPermission, hrKey:hrKeyPermission, vote:votePermission, propose:proposePermission, sendDelegate:sendDelegatePermission, receiveDelegate:receiveDelegatePermission}}])
      console.log(JSON.stringify(keyPermissions));
    }

    const handleDeleteKeyPermission = (event: any, id:number) => {
      event.preventDefault();
      let key_permissions:any = keyPermissions;
      key_permissions = key_permissions.splice(id,1);

      var filtered = keyPermissions.filter(function(value, index, arr){ 
        return value !== key_permissions;
      });
      setKeyPermissions(filtered);
    }

    const addKeyPermissionValidations = () => {
      let upAddressList:string[] = [];
      if (!upAddress || upAddress.length === 0) {
          return "Please enter a User Profile Address";
      }
      if (upAddress.length !== 42 || upAddress.slice(0,2) !== '0x'){
        return "Invalid Address"
      }
      if (!masterKeyPermission && !hrKeyPermission && !votePermission && !proposePermission && !sendDelegatePermission && !receiveDelegatePermission) {
        return "No key permission provided";
      }

      Object.entries(keyPermissions).forEach(([key, value], index) => {
        upAddressList.push(value.upAddress);
      });
      if (upAddressList.includes(upAddress)){
        return "UP address already exists";
      }
      // getUpName(upAddress);
      return "success";
    }

    const formSubmitValidations = () => {
      if (!keyPermissions || keyPermissions.length === 0) {
          return "Please add a User Profile with atleast one key permission";
      }
      return "success";
    }

    const handleSubmit = (event: any) => {
      event.preventDefault();
      const validationResult = formSubmitValidations();
      if (validationResult !== "success") {
          return toast.error(validationResult,
          {position: toast.POSITION.BOTTOM_RIGHT});
      }
      handleSubmitCreate("CreateVault");
    }

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    return(
      <div className="bg-welcome pt-28  min-h-[100vh] w-full px-5 md:px-60">
        <h1 className="text-white text-sm py-2">Step 2</h1>
        <h1 className="text-white text-lg font-bold">Create your Key Permissions</h1>
        
        <div className="flex flex-row justify-between">
          <form onSubmit={handleSubmit} className="w-3/5">
            <div className="pl-32 py-4">
              <label className="block text-slate-400 text-sm font-normal" htmlFor="keyTitle">
                UP Address
              </label>
              <div className="flex flex-row justify-between items-center">
                <Input placeholder="" name="up_address" type="text" handleChange={(e:any) => setUpAddress(e.target.value)} />
                <button
                  type="button"
                  onClick={handleAddKeyPermission}
                  className="flex justify-center rounded-full items-center 
                    border border-transparent shadow-sm px-2 mx-2 py-2 bg-[#C3073F]
                    text-base font-medium text-white hover:bg-[#ac0537] 
                      sm:w-auto sm:text-sm"
                >
                  <AiOutlineUserAdd className="w-6" color="#fff" fontSize={21}  />
                </button>
              </div>

              <label className="block pt-4 text-slate-400 text-sm font-normal" htmlFor="categories">
                Key Permissions
              </label>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="masterKey" onClick ={(e:any) => setMasterKeyPermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="masterKey" className="px-2 text-white text-sm font-medium">Master Key</label>
              </div>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="hrKey" onClick ={(e:any) => setHrKeyPermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="hrKey" className="px-2 text-white text-sm font-medium">HR Key</label>
              </div>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="vote" onClick ={(e:any) => setVotePermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="vote" className="px-2 text-white text-sm font-medium">Vote</label>
              </div>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="propose" onClick ={(e:any) => setProposePermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="propose" className="px-2 text-white text-sm font-medium">Propose</label>
              </div>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="sendDeligate" onClick ={(e:any) => setSendDelegatePermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="sendDeligate" className="px-2 text-white text-sm font-medium">Send Delegate</label>
              </div>
              <div className="flex items-center my-3">
                  <input type="checkbox" name="receiveDelegate" onClick ={(e:any) => setReceiveDelegatePermission(e.target.checked)} className="accent-[#C3073F] focus:accent-[#ac0537]"/>
                  <label htmlFor="receiveDelegate" className="px-2 text-white text-sm font-medium">Receive Delegate</label>
              </div>
              <button
                type="submit"
                className="flex justify-center rounded-md item-center mt-[16px]
                  border border-transparent shadow-sm px-4 py-2 bg-[#C3073F]
                  text-base font-medium text-white hover:bg-[#ac0537] 
                    sm:w-auto sm:text-sm"
              >
                Next
                <MdNavigateNext className="pl-[2px] w-6" color="#fff" fontSize={20}  />
              </button>
            </div>
          </form>
          { keyPermissions && keyPermissions.length > 0 &&
          <div className="m-4 p-4 bg-[#4E4E50] overflow-auto max-h-[347.5px] rounded-md w-2/6">
            <h1 className="text-white text-center text-base font-semibold pb-1">Dao Members</h1>
            {keyPermissions.map((item, index) => (
                <PermittedDaoMembers key={index} id={index} upAddress={item.upAddress} keyPermissions={item.keyPermissions} handleDeleteKeyPermission={handleDeleteKeyPermission}/> 
              ))}
          </div>
          }
        </div>
      </div>
    );
  }
  
export default CreateKeyPermissions;

export interface keyPermissionInterface {
    masterKey: boolean;
    hrKey: boolean;
    vote: boolean;
    propose: boolean;
    sendDelegate: boolean;
    receiveDelegate: boolean;
}

const PermittedDaoMembers = ( props: {keyPermissions: keyPermissionInterface, upAddress:string, id:number, handleDeleteKeyPermission:any} ) => {
  const { upAddress, keyPermissions, id, handleDeleteKeyPermission } = props;
  const [upName, setUpName] = useState<string>('');

  const getUpName = async (upAddress:string) => {
    try {
      const profileData:any = await fetchErc725Data(upAddress);
      if (profileData.value.LSP3Profile) {
        const name = profileData?.value?.LSP3Profile?.name;
        setUpName(name);
        // console.log("profileName = ", name)
      }
    } catch (error) {
        setUpName(shortenAddress(upAddress));
        console.log(upAddress,'This is not an ERC725 Contract');
    }  
  }

  useEffect(() => {
    getUpName(upAddress)
  }, [])

  return (
    <div className="flex justify-between items-center p-1 hover:bg-[#1A1A1D] hover:rounded-lg">
      <StyledTooltip title={<TooltipContainer keyPermissions={keyPermissions}/>} placement="right" arrow>
        <div className="flex justify-between">
          <AiOutlineUser className="w-6" color="#fff" fontSize={21} />
          <h1 className="text-white text-sm">{upName}</h1>
        </div>
      </StyledTooltip>

      <button
          type="button"
          onClick={(event:any) => handleDeleteKeyPermission(event, id)}
          className="flex justify-center rounded-full items-center 
            border border-transparent shadow-sm px-1 mx-1 py-1 bg-[#1A1A1D]
            text-base font-medium text-white hover:bg-[#ac0537] 
              w-auto text-sm"
        >
        <AiFillDelete className="w-4" color="#fff" fontSize={18} />
      </button>
    </div>
  )
}

const TooltipContainer = (props: {keyPermissions:any}) => {
  const { keyPermissions } = props;
  return (
    <div className="py-1">
      <h1 className="text-[#08b35d] text-base font-semibold pb-1">Permissions</h1>
      <div>
        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.masterKey ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.masterKey ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1 `}>Master Key</h1>
        </div>
        
        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.hrKey ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.hrKey ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1 `}>HR Key</h1>
        </div>

        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.vote ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.vote ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1`}>Vote</h1>
        </div>

        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.propose ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.propose ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1`}>Propose</h1>
        </div>

        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.sendDelegate ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.sendDelegate ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1`}>Send Delegate</h1>
        </div>
        
        <div className="flex flex-row items-center py-[2px]">
          { keyPermissions.receiveDelegate ?
            <AiFillCheckCircle className="w-4" fill="#08b35d" fontSize={16}  />
            :
            <AiFillCheckCircle className="w-4" fill="#1A1A1D" fontSize={16}  />
          }
          <h1 className={`${keyPermissions.receiveDelegate ?"text-[#08b35d] font-bold":"text-[#1A1A1D] font-light"} text-xs px-1`}>Receive Delegate</h1>
        </div>
      </div>
    </div>
  );
}