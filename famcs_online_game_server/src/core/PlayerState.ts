import {PositionDescriptor} from "../../../famcs_online_game_client/src/map/discriptors/PositionDescriptor";

export interface PlayerState {

    id: number,

    type?: string,

    ignoreTicks: number,

    playerPosition: PositionDescriptor

}