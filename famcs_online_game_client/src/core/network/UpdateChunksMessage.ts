import {ChunkDescriptor} from "../../map/discriptors/ChunkDescriptor";

export interface UpdateChunksMessage {

    unloadIds: number[],

    loadChunks: ChunkDescriptor[]

}