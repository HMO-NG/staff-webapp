
export const useLocalStorage = () => {

    const getItem = (key:string) => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch (error) {
            console.log(error)
        }
    }

    const setItem = (key:string,data:string) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
            console.log(error)
        }
    }

    const removeItem = (key:string) => {
        try {
            window.localStorage.removeItem(key)
        } catch (error) {
            console.log(error)
        }
    }

    return { getItem, setItem, removeItem }
}