import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"Job",
    initialState:{
        allJobs:[],   //since job are mulitple and to to write null use []
        allAdminJobs:[],
        singleJob:null,
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        filteredJobs:[]
    },
    reducers:{
        //actions
        setAllJobs:(state,action)=>{
            state.allJobs=action.payload;
        },
        setSingleJob:(state,action)=>{
            state.singleJob=action.payload;
        },
        setAllAdminJobs:(state,action)=>{
            state.allAdminJobs=action.payload;
        },
        setSearchJobByText:(state,action)=>{
            state.searchJobByText=action.payload;
        },
        setAllAppliedJobs:(state,action)=>{
            state.allAppliedJobs=action.payload;
        },
        setSearchedQuery:(state,action)=>{
            state.searchedQuery=action.payload;
        },
        setFilteredJobs:(state,action)=>{
            state.filteredJobs=action.payload;
        }
    }
});

export const {setAllJobs,setSingleJob,setAllAdminJobs,setSearchJobByText,setAllAppliedJobs,setSearchedQuery,setFilteredJobs}=jobSlice.actions;
export default jobSlice.reducer;