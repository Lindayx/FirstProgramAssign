import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import MarkFav from '../MarkFav';

export default function PetInfo({pet}) {
  return (
    <View>
      <Image source={{uri:pet.imageUrl}}
        style={{
            width:'100%',
            height:500,
            objectFit:'cover'
        }}
        />
        <View style={{
            padding:20,
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
        }}>
            <View>
                <Text style={{
                    fontFamily:'ourfit-bold',
                    fontSize:27
                }}>{pet?.name}</Text>
                
                <Text style={{
                    fontFamily:'outfit',
                    fontSize:16,
                    color:Colors.GRAY
                }}>{pet?.address}</Text>
            </View>
            <MarkFav pet={pet}/>
        </View>
    </View>
  )
}