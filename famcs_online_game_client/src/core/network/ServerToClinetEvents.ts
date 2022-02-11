import {TileDescriptor} from "../../map/discriptors/TileDescriptor"

export interface ServerToClientEvents {
    initialize: (td:TileDescriptor[][]) => void
}