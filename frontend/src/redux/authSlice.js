import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
    reducers:{                                  //Reducers → Functions that determine how the state should change based on actions.
        //actions
        setLoading:(state,action) =>{
            state.loading = action.payload;    //updates the loading state based on the action’s payload.
        },
        setUser:(state,action) =>{
            state.user = action.payload;
        }
    }
})
export const {setLoading,setUser}= authSlice.actions;
export default authSlice.reducer;