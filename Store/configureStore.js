import { createStore, combineReducers } from "redux";
import toogleFavorite from "./Reducers/favoriteReducer";
import setAvatar from "./Reducers/setAvatar";
import { persistCombineReducers } from 'redux-persist'
import AsyncStorage from "@react-native-async-storage/async-storage";
const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage
}

export default createStore(persistCombineReducers(rootPersistConfig, {toogleFavorite, setAvatar}))