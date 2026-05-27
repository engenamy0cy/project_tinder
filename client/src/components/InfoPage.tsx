import type { Users } from "@/types/infopage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

const API_URLS_INFO = "http://127.0.0.1:8000/users/"

type Props = {
    slug: string;
}

const infoPageList = ({ slug }: Props) => {
    const [users, setUsers] = useState<Users[]>([]); // ← массив пользователей
    const [loading, setLoading] = useState(true);
    
    const getUsers = async () => {
        try {
            const response = await axios.get<Users[]>(`${API_URLS_INFO}${slug}/`);
            console.log(response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getUsers();
    }, []);
    
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Загрузка...</Text>
            </View>
        );
    }
    
    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={{ 
                    padding: 15, 
                    borderBottomWidth: 1, 
                    borderBottomColor: '#ccc',
                    backgroundColor: '#fff'
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.username}</Text>
                    <Text>ID: {item.id}</Text>
                    <Text>Email: {item.email || "Не указан"}</Text>
                    <Text>Верифицирован: {item.is_verified_flag ? " Да" : " Нет"}</Text>
                    <Text>В сети: {item.is_online_flag ? " Да" : " Нет"}</Text>
                    <Text>Был в сети: {new Date(item.last_activity_at).toLocaleString()}</Text>
                </View>
            )}
        />
    );
};

export default infoPageList;