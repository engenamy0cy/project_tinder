import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import type { Profiles } from "@/types/profiles";
import ProfilesCard from "@/components/ProfilesCard";

const API_URL_PROFILES = "http://127.0.0.1:8000/profiles/profiles/"
const ProfilesList = () => {
    const [profiles, setProfiles] = useState<Profiles[]>([]);

    const getProfiles = async () => {
        try {
            const response = await axios.get<Profiles[]>(API_URL_PROFILES);
            console.log(response)
            setProfiles(response.data);
        } catch (error) {
            console.error("Ошибка загрузки профилей:", error);
        }
    };

    useEffect(() => {
        getProfiles();
    }, []);

    return (
        <View>
            <Text>Профиля</Text>
            <FlatList
                data={profiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProfilesCard profiles={item} />
                )}
            />
        </View>
    );
};

export default ProfilesList;