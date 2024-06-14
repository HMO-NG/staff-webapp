import { createProvider } from "@/services/ProviderService";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../localStorage";

function useProvider() {
    const navigate = useNavigate()
    const {removeItem} = useLocalStorage("admin")

    const useCreateProvider = async (data: any) => {
        try {
            const response = await createProvider(data)
            console.log("the response is", response)
        } catch (error: any) {
            console.log("the error is", error?.response?.request.status)


            if(error?.response?.request.status == 403){
                removeItem()
                navigate("/sign-in")
            }
        }
    }

    return {
        useCreateProvider
    }
}

export default useProvider