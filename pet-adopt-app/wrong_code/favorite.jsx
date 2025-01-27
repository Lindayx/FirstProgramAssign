import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Shared from './../../Shared/Shared'
import { useUser } from '@clerk/clerk-expo'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import PetListItem from './../../components/Home/PetListItem'
export default function Favorite() {

  const {user} = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList]=useState([]);
  useEffect(()=>{
    user&&GetFavPetIds();
  },[user])
  // useEffect(()=>{
  //   user&&GetFavPetIds();
  // },[favIds])
  // Fav Ids
  const GetFavPetIds = async()=>{
    const result=await Shared.GetFavList(user);
    setFavIds(result?.favorites);
    GetFavPetList(result?.favorites);
  }
  // Fetch Related Pet Items
  const GetFavPetList=async(favId_)=>{
    setFavPetList([]);
    console.log("here");
    console.log(favIds);
    const q=query(collection(db, 'Pets'), where('id', 'in', favId_));
    const querySnapshot=await getDocs(q);
    console.log("there");
    console.log(querySnapshot.docs());
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setFavPetList(prev=>[...prev,doc.data()]);
    });
  }
  return (
    <View style={{
      padding:20,
      marginTop:20
    }}>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30
      }}>Favorites</Text>

      <FlatList
      data={favPetList}
      renderItem={({item,index})=>{
        <View>
          <PetListItem pet={item}/>
        </View>
      }}
      />
    </View>
  )
}