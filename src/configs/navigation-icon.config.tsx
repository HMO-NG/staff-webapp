import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiIdentification

} from 'react-icons/hi'
import { RiGitRepositoryPrivateFill,RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MdOutlineHealthAndSafety } from "react-icons/md";
export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    hiIdentification:<HiIdentification/>,
    RiGitRepositoryPrivateLine:<RiGitRepositoryPrivateLine />,
    MdOutlineHealthAndSafety:<MdOutlineHealthAndSafety />
}

export default navigationIcon
