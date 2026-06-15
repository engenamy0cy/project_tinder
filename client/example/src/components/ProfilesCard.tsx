import { Profiles } from "../../../src1/types/profiles";
import {Image,Text,View} from "react-native";


type Props = {
    profiles:Profiles;
}

const ProfilesCard = ({profiles}:Props) => {
    return(
       < View>
            {profiles.avatar ? (
                <Image source={{uri:profiles.avatar}} style={{width:200, height:200}} />
            ):null}
            <Text>{profiles.first_name}</Text>
            <Text>{profiles.last_name}</Text>
            <Text>{profiles.bio}</Text>
            <Text>{profiles.age}</Text>
            <Text>{profiles.main_game}</Text>
            <Text>{profiles.hours_in_game}</Text>
            <Text>{profiles.gender}</Text>
            <Text>{profiles.country}</Text>
       </View>
    );
};

export default ProfilesCard