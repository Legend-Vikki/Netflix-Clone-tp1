import axios from "axios"
import React, {useCallback, useMemo } from "react"
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai"

import useCurrentUser from "@/hooks/useCurrentUser"
import usefavorites from "@/hooks/useFavorites"

interface favoriteButtonProps {
    movieId: string
}

const FavoriteButton: React.FC<favoriteButtonProps> = ({ movieId }) =>{
    const { mutate: mutatefavorites } = usefavorites()
    const { data: currentUser, mutate } = useCurrentUser()

    const isfavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || []

        return list.includes(movieId)
    }, [currentUser, movieId])

    const togglefavorites = useCallback(async () => {
        let response

        if (isfavorite) {
            response = await axios.delete('/api/favorite', { data: { movieId } })
        } else {
            response = await axios.post('/api/favorite', { movieId })
        }
        
        const updatedfavoriteIds = response?.data?.favoriteIds
        
        mutate({ 
            ...currentUser, 
            favoriteIds: updatedfavoriteIds,
        });
        mutatefavorites()
    }, [movieId, isfavorite, currentUser, mutate, mutatefavorites])

    const Icon = isfavorite ? AiOutlineCheck : AiOutlinePlus

    return (
        <div onClick={togglefavorites}

            className=" cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300
        ">
            <Icon className="text-white size={25}"/>
        </div>
    )
}

export default FavoriteButton