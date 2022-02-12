import {PlayerDescriptor} from "../../map/discriptors/PlayerDescriptor";
import {TileDescriptor} from "../../map/discriptors/TileDescriptor";

export interface InitMessage {

    player: PlayerDescriptor,

    tiles: TileDescriptor[][]

}