import React, {useEffect, useContext, useState} from "react";
import { shortenAddress } from "../../utils/shortenAddress";
import { SingleSelect } from "../../components";
import { ProfileContext } from '../../context/ProfileContext'

const About = (props: {handleComponent: any}) => {
    const {handleComponent} = props;
    const { accountAddress, profileData } = useContext(ProfileContext);
    const [upName, setUpName] = useState<string>('');
    const state = [
        {
            value: "State 1",
            label: "State 1",
        },
        {
            value: "State 2",
            label: "State 2",
        },
        {
            value: "State 2",
            label: "State 2",
        },
      ]

    const getUserProfile = async (upAddress:string) => {
        try {
            if (profileData.value.LSP3Profile) {
                const profile = profileData?.value?.LSP3Profile;
                setUpName(profile?.name);
            }
        } catch (error) {
            setUpName(shortenAddress(upAddress));
            console.log(upAddress,'This is not an ERC725 Contract');
        }  
    }

    useEffect(() => {
        if (accountAddress) {
            getUserProfile(accountAddress);
        }
        window.scrollTo(0, 0)
    }, [])
    
    const votingList = [0,1,2,3]
    return (
        <div className="pt-28 text-white min-h-[100vh] w-5/6 flex-column justify-start items-start">
            <div className="flex-col justify-start items-start w-full">
                <p className="text-2xl text-bold text-center">About</p>
                <div className='flex justify-end my-2'>
                
                </div>

            </div>
        </div>

    );
}

export default About;

