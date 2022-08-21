import React, { useEffect, useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { requestAccount, getAccountBalance } from '../services/web3';
import { fetchErc725Data } from '../services/erc725';

import UniversalReceiverDelegateUPJSON from '../contracts/artifacts/contracts/deps/UniversalReceiverDelegateUP.sol/UniversalReceiverDelegateUP.json';
import UniversalReceiverDelegateVaultJSON from '../contracts/artifacts/contracts/deps/UniversalReceiverDelegateVault.sol/UniversalReceiverDelegateVault.json';
import UniversalProfileJSON from '../contracts/artifacts/contracts/deps/UniversalProfile.sol/UniversalProfile.json';
import VaultJSON from '../contracts/artifacts/contracts/deps/Vault.sol/Vault.json';
import KeyManagerJSON from '../contracts/artifacts/contracts/deps/KeyManager.sol/KeyManager.json';
import DaoPermissionsJSON from '../contracts/artifacts/contracts/Dao/DaoPermissions.sol/DaoPermissions.json';
import DaoDelegatesJSON from '../contracts/artifacts/contracts/Dao/DaoDelegates.sol/DaoDelegates.json';
import DaoProposalsJSON from '../contracts/artifacts/contracts/Dao/DaoProposals.sol/DaoProposals.json';

import { ethers } from "ethers";

interface DeployDaoContextInterface {
    deployUniversalReceiverDelegateUP: any,
    deployUniversalReceiverDelegateVault: any,
    deployUniversalProfile: any,
    deployVault: any,
    deployKeyManager: any,
    deployDaoPermissions: any,
    deployDaoDelegates: any,
    deployDaoProposals: any,
}

export const DeployDaoContext = React.createContext<DeployDaoContextInterface>(
    {
        deployUniversalReceiverDelegateUP: () => {},
        deployUniversalReceiverDelegateVault: () => {},
        deployUniversalProfile: () => {},
        deployVault: () => {},
        deployKeyManager: () => {},
        deployDaoPermissions: () => {},
        deployDaoDelegates: () => {},
        deployDaoProposals: () => {},
    }   
);

export const DeployDaoProvider = ({children}:any) => {
    const [owner, setOwner] = useState<string>('');
    const [signer, setSigner] = useState<any>([]);
    const [provider, setProvider] = useState<any>([]);
    const [universalReceiverDelegateUPState, setUniversalReceiverDelegateUPState] = useState<any>([]);
    const [universalReceiverDelegateVaultState, setUniversalReceiverDelegateVaultState] = useState<any>([]);

    const [universalProfileState, setUniversalProfileState] = useState<any>([]);
    const [vaultState, setVaultState] = useState<any>([]);
    const [keyManagerState, setKeyManagerState] = useState<any>([]);
    const [daoPermissionsState, setDaoPermissionsState] = useState<any>([]);
    const [daoDelegatesState, setDaoDelegatesState] = useState<any>([]);
    const [daoProposalsState, setDaoProposalsState] = useState<any>([]);

    useEffect(() => {
        const fetchProvider = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider);
            console.log("provider ",provider);
        
            const signer = provider.getSigner();
            setSigner(signer);
            console.log("provider ",signer);
            
            const owner = await signer.getAddress();
            setOwner(owner);
            console.log("owner ",owner);
        }
        fetchProvider();
    }, []);

      
    const deployUniversalReceiverDelegateUP = async () => {
        try {
            const UniversalReceiverDelegateUP  = new ethers.ContractFactory(UniversalReceiverDelegateUPJSON.abi, UniversalReceiverDelegateUPJSON.bytecode, signer);
            const universalReceiverDelegateUP  = await UniversalReceiverDelegateUP.deploy();
            const result = await universalReceiverDelegateUP.deployTransaction.wait();
            console.log("universalReceiverDelegateUP is deployed",universalReceiverDelegateUP.address); 
            setUniversalReceiverDelegateUPState(universalReceiverDelegateUP);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployUniversalReceiverDelegateVault = async () => {
        try {
            const UniversalReceiverDelegateVault  = new ethers.ContractFactory(UniversalReceiverDelegateVaultJSON.abi, UniversalReceiverDelegateVaultJSON.bytecode, signer);
            const universalReceiverDelegateVault  = await UniversalReceiverDelegateVault.deploy();
            const result = await universalReceiverDelegateVault.deployTransaction.wait();
            console.log("universalReceiverDelegateVault"," is deployed",universalReceiverDelegateVault.address);
            setUniversalReceiverDelegateVaultState(universalReceiverDelegateVault);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployUniversalProfile = async () => {
        try {
            const UniversalProfile  = new ethers.ContractFactory(UniversalProfileJSON.abi, UniversalProfileJSON.bytecode, signer);
            const universalProfile  = await UniversalProfile.deploy(owner,universalReceiverDelegateUPState.address);
            const result = await universalProfile.deployTransaction.wait();
            console.log("universalProfile"," is deployed",universalProfile.address); 
            setUniversalProfileState(universalProfile);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployVault = async () => {
        try {
            const Vault  = new ethers.ContractFactory(VaultJSON.abi, VaultJSON.bytecode, signer);
            const vault  = await Vault.deploy(owner,universalReceiverDelegateVaultState.address);
            const result = await vault.deployTransaction.wait();
            console.log("vault"," is deployed",vault.address);
            setVaultState(vault);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }
    
    const deployKeyManager = async () => {
        try {
            const KeyManager  = new ethers.ContractFactory(KeyManagerJSON.abi, KeyManagerJSON.bytecode, signer);
            const keyManager  = await KeyManager.deploy(universalProfileState.address);
            const result = await keyManager.deployTransaction.wait();
            console.log("keyManager"," is deployed",keyManager.address); 
            setKeyManagerState(keyManager);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployDaoPermissions = async () => {
        try {
            const DaoPermissions  = new ethers.ContractFactory(DaoPermissionsJSON.abi, DaoPermissionsJSON.bytecode, signer);
            const daoPermissions  = await DaoPermissions.deploy(universalProfileState.address, keyManagerState.address);
            const result = await daoPermissions.deployTransaction.wait();
            console.log("daoPermissions"," is deployed",daoPermissions.address); 
            setDaoPermissionsState(daoPermissions);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployDaoDelegates = async () => {
        try {
            const DaoDelegates  = new ethers.ContractFactory(DaoDelegatesJSON.abi, DaoDelegatesJSON.bytecode, signer);
            const daoDelegates  = await DaoDelegates.deploy(universalProfileState.address, keyManagerState.address);
            const result = await daoDelegates.deployTransaction.wait();
            console.log("daoDelegates"," is deployed",daoDelegates.address); 
            setDaoDelegatesState(daoDelegates);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    const deployDaoProposals = async () => {
        try {
            const DaoProposals  = new ethers.ContractFactory(DaoProposalsJSON.abi, DaoProposalsJSON.bytecode, signer);
            const daoProposals  = await DaoProposals.deploy(universalProfileState.address, keyManagerState.address);
            const result = await daoProposals.deployTransaction.wait();
            console.log("daoProposals"," is deployed",daoProposals.address); 
            setDaoProposalsState(daoProposals);
            return result.transactionHash
        } catch (error) {
            console.log(error);
            return "Stopped"
        }
    }

    return (
        <DeployDaoContext.Provider 
            value={{
                deployUniversalReceiverDelegateUP:deployUniversalReceiverDelegateUP,
                deployUniversalReceiverDelegateVault:deployUniversalReceiverDelegateVault,
                deployUniversalProfile:deployUniversalProfile,
                deployVault:deployVault,
                deployKeyManager:deployKeyManager,
                deployDaoPermissions:deployDaoPermissions,
                deployDaoDelegates:deployDaoDelegates,
                deployDaoProposals:deployDaoProposals,
                }}>
            {children}
        </DeployDaoContext.Provider>
    );
};
