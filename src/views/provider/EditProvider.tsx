import { useEffect } from "react"
import { useLocalStorage } from '@/utils/localStorage'


function EditProvider() {

    const { getItem } = useLocalStorage()


    useEffect(() => {


    })

    return (
        <div>
            This is to edit provider details
            {getItem('provider')}
        </div>
    )
}

export default EditProvider