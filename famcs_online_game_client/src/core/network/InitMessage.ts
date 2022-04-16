import {PlayerDescriptor} from "../../map/discriptors/PlayerDescriptor";
import {ChunkDescriptor} from "../../map/discriptors/ChunkDescriptor";
import {BorderDescriptor} from "../../map/discriptors/BorderDescriptor";

export interface InitMessage {

    player: PlayerDescriptor,

    chunks: ChunkDescriptor[],

    border: BorderDescriptor,

}