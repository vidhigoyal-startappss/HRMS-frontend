import API from "./auth";

export const fetchNotifications = async (userId:string) => {
    console.log(userId)
    try{
        const response = await API.get(`/api/notifications/${userId}`)
        console.log(response)
        return response.data
    }
    catch (error){
        console.log("fetch notification error",error)
        throw error;
    }

}