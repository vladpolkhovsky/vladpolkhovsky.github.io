import {PlayerDescriptor} from "../../map/discriptors/PlayerDescriptor";
import {ChunkDescriptor} from "../../map/discriptors/ChunkDescriptor";

export interface InitMessage {

    player: PlayerDescriptor,

    chunks: ChunkDescriptor[]

}