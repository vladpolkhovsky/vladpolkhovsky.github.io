import {GameDescriptor} from "./GameDescriptor";
import {PositionDescriptor} from "./PositionDescriptor";

export interface BorderDescriptor extends GameDescriptor, PositionDescriptor {

    r: number,

    objectType: "border"
    
}