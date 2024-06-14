import { createProvider } from "@/services/ProviderService";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../localStorage";

function useProvider() {
    const navigate = useNavigate()
    const {removeItem} = useLocalStorage()



    const useCreateProvider = async (data: any) => {
        try {
            const response = await createProvider(data)

            console.log("the response is", response)

        } catch (error: any) {

            if(error?.response?.request.status == 403){
                // clear session cache, this doesn't clear the user cache, i don't know why
                // the session cache needs to be clear else, user won't be able to navigate
                // to sign in

                console.log("error one", error)

                removeItem("admin")

                navigate("/sign-in")

            }

            console.log("error two", error)
        }
    }

    return {
        useCreateProvider
    }
}

export default useProvider